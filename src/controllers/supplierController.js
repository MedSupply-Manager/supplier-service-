exports.getAllProducts = (req, res) => {
    res.json([
      { id: 1, name: 'Vitamin C', quantity: 50 },
      { id: 2, name: 'Protein Powder', quantity: 20 }
    ]);
  };
  