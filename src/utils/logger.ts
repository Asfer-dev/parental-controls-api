import Log from "../models/Log";

export const logActivity = async (
  childId: string,
  type: string,
  message: string
) => {
  try {
    await Log.create({ childId, type, message });
  } catch (err) {
    console.error("Logging failed:", err);
  }
};
