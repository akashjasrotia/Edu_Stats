import { getDataById } from '../models/dataModel';

export const fetchData = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await getDataById(id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};