import { Request, Response } from 'express';
import CV from '../models/CV';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get CV data
// @route   GET /api/cv
// @access  Public
export const getCV = async (req: Request, res: Response): Promise<void> => {
  try {
    const cv = await CV.findOne();
    if (cv) {
      res.json(cv);
    } else {
      res.status(404).json({ message: 'CV not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update CV data
// @route   PUT /api/cv
// @access  Private
export const updateCV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let cv = await CV.findOne({ userId: req.user._id });

    if (!cv) {
      // If no CV exists, create one
      cv = new CV({
        userId: req.user._id,
        ...req.body
      });
      const createdCV = await cv.save();
      res.status(201).json(createdCV);
      return;
    }

    // Update existing CV
    const updatedCV = await CV.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedCV);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
