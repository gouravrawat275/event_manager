import Settings from "../models/Settings.js";

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();
    Object.assign(settings, req.body);
    await settings.save();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};
