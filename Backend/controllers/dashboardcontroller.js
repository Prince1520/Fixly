const Dashboard = require('../models/dashboard');
const ServiceRequest = require('../models/servicerequest');
const User = require('../models/users');

exports.updateDashboardMetrics = async (userId) => {
  try {
    const user = await User.findById(userId);
    const dashboard = await Dashboard.findOne({ userId });

    if (!dashboard || !user) return;

    // Update common metrics
    const pendingRequests = await ServiceRequest.countDocuments({
      userId,
      status: 'pending'
    });

    const updates = {
      'metrics.pendingRequests': pendingRequests
    };

    if (user.userType === 'provider') {
      // Update provider-specific metrics
      const completedServices = await ServiceRequest.countDocuments({
        providerId: userId,
        status: 'completed'
      });

      const activeRequests = await ServiceRequest.countDocuments({
        providerId: userId,
        status: 'active'
      });

      const earnings = await ServiceRequest.aggregate([
        {
          $match: {
            providerId: userId,
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      updates['metrics.totalServicesProvided'] = completedServices;
      updates['metrics.activeRequests'] = activeRequests;
      updates['metrics.totalEarnings'] = earnings[0]?.total || 0;
    }

    await Dashboard.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating dashboard metrics:', error);
  }
};
