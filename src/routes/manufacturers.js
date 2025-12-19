// src/routes/manufacturers.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Checkout = require('../models/checkout');
const CheckoutItem = require('../models/checkoutItem');
const sequelize = require('../config/database');
const PDFDocument = require('pdfkit');

// Get all manufacturers from checkout records
router.get('/manufacturers', async (req, res) => {
    try {
        // SIMPLIFIED VERSION - No Sequelize.fn issues
        const checkouts = await Checkout.findAll({
            attributes: ['establishment_name'],
            group: ['establishment_name'],
            order: [['establishment_name', 'ASC']],
            raw: true
        });

        // Process the results manually
        const manufacturers = await Promise.all(
            checkouts.map(async (checkout) => {
                const establishmentName = checkout.establishment_name;
                
                // Get deal count and total business for this manufacturer
                const deals = await Checkout.findAll({
                    where: { establishment_name: establishmentName },
                    raw: true
                });
                
                const deal_count = deals.length;
                const total_business = deals.reduce((sum, deal) => sum + (parseFloat(deal.total_amount) || 0), 0);
                
                return {
                    name: establishmentName,
                    deal_count,
                    total_business: total_business.toFixed(2)
                };
            })
        );

        res.json(manufacturers);
    } catch (error) {
        console.error('Error fetching manufacturers:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get deals for a specific manufacturer - SIMPLIFIED VERSION
router.get('/deals', async (req, res) => {
    try {
        const { manufacturer } = req.query;
        
        console.log('Fetching deals for manufacturer:', manufacturer);
        
        if (!manufacturer) {
            return res.status(400).json({ error: 'Manufacturer name is required' });
        }

        // Get deals without include (simpler version)
        const deals = await Checkout.findAll({
            where: { 
                establishment_name: manufacturer 
            },
            order: [['createdAt', 'DESC']]
        });

        console.log(`Found ${deals.length} deals for ${manufacturer}`);

        // Get checkout items separately
        const formattedDeals = await Promise.all(
            deals.map(async (deal) => {
                // Get checkout items for this deal
                const items = await CheckoutItem.findAll({
                    where: { checkout_id: deal.id },
                    raw: true
                });

                return {
                    id: deal.id,
                    manufacturer: deal.establishment_name,
                    date: deal.createdAt ? new Date(deal.createdAt).toISOString().split('T')[0] : 'N/A',
                    amount: deal.total_amount,
                    status: 'Completed',
                    payment_method: deal.payment_method,
                    products: deal.products || [],
                    items: items,
                    notes: 'Auto-generated from checkout record'
                };
            })
        );

        res.json(formattedDeals);
        
    } catch (error) {
        console.error('Error in /deals endpoint:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to fetch deals',
            details: error.message 
        });
    }
});

// Generate PDF contract for a deal
router.post('/contracts/generate/:dealId', async (req, res) => {
    try {
        const { dealId } = req.params;
        
        const deal = await Checkout.findOne({
            where: { id: dealId }
        });

        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        // Get checkout items for this deal
        const items = await CheckoutItem.findAll({
            where: { checkout_id: dealId },
            raw: true
        });

        // Create PDF document
        const doc = new PDFDocument();
        
        // Set response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="contract-${dealId}.pdf"`);
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Add content to PDF
        doc.fontSize(20).text('PHARMASTOCK CONTRACT', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(14).text(`Contract Number: CON-${dealId}-${Date.now()}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.text(`Manufacturer: ${deal.establishment_name}`);
        doc.moveDown();
        
        doc.fontSize(16).text('Order Details:', { underline: true });
        doc.moveDown();
        
        doc.fontSize(12).text(`Order ID: ${dealId}`);
        doc.text(`Order Date: ${deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : 'N/A'}`);
        doc.text(`Total Amount: ${deal.total_amount} DA`);
        doc.text(`Payment Method: ${deal.payment_method}`);
        doc.moveDown();
        
        // Add products section
        doc.fontSize(14).text('Products:', { underline: true });
        doc.moveDown();
        
        if (items.length > 0) {
            // Create a simple table
            const tableTop = doc.y;
            const productCol = 50;
            const qtyCol = 300;
            const priceCol = 400;
            
            // Headers
            doc.fontSize(12);
            doc.text('Product ID', productCol, tableTop);
            doc.text('Quantity', qtyCol, tableTop);
            
            // Table rows
            let y = tableTop + 20;
            
            items.forEach((item, index) => {
                doc.text(item.product_id.toString(), productCol, y);
                doc.text(item.quantity.toString(), qtyCol, y);
                y += 20;
            });
            
            doc.moveDown(y - doc.y + 30);
        } else {
            doc.text('No product details available', 50, doc.y);
            doc.moveDown();
        }
        
        // Terms and conditions
        doc.fontSize(12).text('Terms and Conditions:', { underline: true });
        doc.moveDown();
        doc.fontSize(10).text('1. All products must meet pharmaceutical standards and regulations.');
        doc.text('2. Payment is due within 30 days of invoice date.');
        doc.text('3. Any defective products must be reported within 7 days of delivery.');
        doc.text('4. This contract is governed by the laws of Algeria.');
        
        doc.moveDown(2);
        
        // Signature lines
        doc.fontSize(12).text('Agreed and Accepted:', { underline: true });
        doc.moveDown();
        
        doc.text('For PharmaStock:', 50);
        doc.text('_____________________', 50);
        doc.text('Signature', 50);
        doc.text('Date: _______________', 50);
        
        doc.text('For ' + deal.establishment_name + ':', 350);
        doc.text('_____________________', 350);
        doc.text('Signature', 350);
        doc.text('Date: _______________', 350);
        
        // Finalize PDF
        doc.end();
        
    } catch (error) {
        console.error('Error generating contract:', error);
        res.status(500).json({ error: 'Failed to generate contract' });
    }
});

// Get deal details
router.get('/deals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deal = await Checkout.findOne({
            where: { id }
        });

        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        // Get checkout items
        const items = await CheckoutItem.findAll({
            where: { checkout_id: id },
            raw: true
        });

        res.json({
            id: deal.id,
            manufacturer: deal.establishment_name,
            date: deal.createdAt,
            amount: deal.total_amount,
            status: 'Completed',
            payment_method: deal.payment_method,
            products: deal.products || [],
            items: items,
            notes: 'Auto-generated from checkout record'
        });
    } catch (error) {
        console.error('Error fetching deal details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get deal statistics
router.get('/deals/stats/:manufacturer', async (req, res) => {
    try {
        const { manufacturer } = req.params;
        
        const deals = await Checkout.findAll({
            where: { establishment_name: manufacturer },
            raw: true
        });

        if (deals.length === 0) {
            return res.json({
                total_deals: 0,
                total_value: 0,
                average_deal_value: 0,
                first_deal_date: null,
                last_deal_date: null
            });
        }

        const total_deals = deals.length;
        const total_value = deals.reduce((sum, deal) => sum + (parseFloat(deal.total_amount) || 0), 0);
        const average_deal_value = total_value / total_deals;
        
        const dates = deals.map(d => d.createdAt).filter(Boolean);
        const first_deal_date = dates.length > 0 ? new Date(Math.min(...dates.map(d => new Date(d)))) : null;
        const last_deal_date = dates.length > 0 ? new Date(Math.max(...dates.map(d => new Date(d)))) : null;

        res.json({
            total_deals,
            total_value: total_value.toFixed(2),
            average_deal_value: average_deal_value.toFixed(2),
            first_deal_date,
            last_deal_date
        });
    } catch (error) {
        console.error('Error fetching deal stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test endpoint
router.get('/test', async (req, res) => {
    try {
        // Test database connection
        const checkouts = await Checkout.findAll({
            limit: 5,
            attributes: ['id', 'establishment_name', 'total_amount', 'createdAt'],
            raw: true
        });
        
        const checkoutCount = await Checkout.count();
        
        res.json({
            message: 'Manufacturers API is working',
            totalCheckouts: checkoutCount,
            sampleCheckouts: checkouts,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ 
            error: 'Test failed',
            details: error.message,
            stack: error.stack 
        });
    }
});

module.exports = router;