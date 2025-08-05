const Item = require('../models/item');
const { Op } = require('sequelize');

exports.getAllItems = async (req, res) => {
  try {
    const { name, category, status, minQty, maxQty } = req.query;

    let where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (category) where.category = { [Op.like]: `%${category}%` };
    if (status) where.status = status;
    if (minQty || maxQty) {
      where.quantity = {
        ...(minQty ? { [Op.gte]: parseInt(minQty) } : {}),
        ...(maxQty ? { [Op.lte]: parseInt(maxQty) } : {})
      };
    }

    const items = await Item.findAll({ where });

    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found matching your criteria.' });
    }

    res.status(200).json({ message: 'Items retrieved successfully', data: items });
  } catch (error) {
    console.error('GET items error:', error.message);
    res.status(500).json({ message: 'Server error while fetching items', error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const raw = req.body;
    const name = raw.name?.trim().replace(/^"+|"+$/g, '');
    const category = raw.category?.trim().replace(/^"+|"+$/g, '');
    const quantity = parseInt(raw.quantity?.trim());
    const status = raw.status?.trim().replace(/^"+|"+$/g, '');
    const image = req.file ? req.file.filename : null;

    if (!name || !category || isNaN(quantity) || !status) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, category, quantity, status',
        received: { name, category, quantity, status }
      });
    }

    const item = await Item.create({ name, category, quantity, status, image });
    res.status(201).json({ message: 'Item created successfully', data: item });
  } catch (error) {
    console.error('CREATE item error:', error.message);
    res.status(500).json({ message: 'Server error while creating item', error: error.message });
  }
};



exports.updateItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, category, quantity, status } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const existing = await Item.findByPk(id);
    if (!existing) return res.status(404).json({ message: 'Item not found' });

    const updatedData = { name, category, quantity, status };
    if (image) updatedData.image = image;

    await Item.update(updatedData, { where: { id } });
    res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('UPDATE item error:', error.message);
    res.status(500).json({ message: 'Server error while updating item', error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findByPk(id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    await Item.destroy({ where: { id } });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('DELETE item error:', error.message);
    res.status(500).json({ message: 'Server error while deleting item', error: error.message });
  }
};
