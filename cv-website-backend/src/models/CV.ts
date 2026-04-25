import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  introduction: { type: String, default: '' },
  avatar: { type: String, default: '' },
  birthday: { type: String, default: '' },
  gender: { type: String, default: '' },
  interests: { type: String, default: '' },
  contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  education: [
    {
      school: { type: String, default: '' },
      major: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' }
    }
  ],
  experience: [
    {
      company: { type: String, default: '' },
      position: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      description: { type: String, default: '' }
    }
  ],
  certificates: [
    {
      name: { type: String, default: '' },
      category: { type: String, default: '' },
      year: { type: String, default: '' }
    }
  ],
  skills: [
    {
      name: { type: String, default: '' },
      level: { type: String, default: '80%' }
    }
  ]
}, {
  timestamps: true,
});

const CV = mongoose.model('CV', cvSchema);
export default CV;
