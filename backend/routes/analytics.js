const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const { Analytics, Message, Feedback } = require('../database/database');
const { logPerformance } = require('../middleware/logging');

// Get analytics dashboard data (admin only)
router.get('/dashboard', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get analytics data
    const analyticsData = await Analytics.getAnalytics(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // Get popular queries
    const popularQueries = await Message.getPopularQueries(10);

    // Get feedback summary
    const feedbackSummary = await Feedback.getSummary();

    // Calculate totals
    const totals = analyticsData.reduce((acc, day) => {
      acc.totalSessions += day.total_sessions || 0;
      acc.totalMessages += day.total_messages || 0;
      acc.uniqueUsers += day.unique_users || 0;
      return acc;
    }, { totalSessions: 0, totalMessages: 0, uniqueUsers: 0 });

    const duration = Date.now() - startTime;
    logPerformance('analytics_dashboard', duration, { period, userRole: req.user.role });

    res.json({
      message: 'Analytics data retrieved successfully',
      period,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      totals,
      dailyData: analyticsData,
      popularQueries,
      feedback: feedbackSummary
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('analytics_dashboard_error', duration, { error: error.message });

    res.status(500).json({
      error: 'Analytics retrieval failed',
      message: 'An error occurred while retrieving analytics data'
    });
  }
});

// Get usage statistics (staff and admin)
router.get('/usage', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Date range required',
        message: 'Please provide startDate and endDate parameters'
      });
    }

    const analyticsData = await Analytics.getAnalytics(startDate, endDate);
    
    const duration = Date.now() - startTime;
    logPerformance('usage_analytics', duration, { startDate, endDate });

    res.json({
      message: 'Usage statistics retrieved successfully',
      dateRange: { startDate, endDate },
      data: analyticsData
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('usage_analytics_error', duration, { error: error.message });

    res.status(500).json({
      error: 'Usage statistics retrieval failed',
      message: 'An error occurred while retrieving usage statistics'
    });
  }
});

// Get popular queries (staff and admin)
router.get('/popular-queries', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { limit = 20 } = req.query;
    
    const popularQueries = await Message.getPopularQueries(parseInt(limit));
    
    const duration = Date.now() - startTime;
    logPerformance('popular_queries', duration, { limit });

    res.json({
      message: 'Popular queries retrieved successfully',
      queries: popularQueries
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('popular_queries_error', duration, { error: error.message });

    res.status(500).json({
      error: 'Popular queries retrieval failed',
      message: 'An error occurred while retrieving popular queries'
    });
  }
});

// Get user feedback summary (staff and admin)
router.get('/feedback', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const feedbackSummary = await Feedback.getSummary();
    
    const duration = Date.now() - startTime;
    logPerformance('feedback_summary', duration);

    res.json({
      message: 'Feedback summary retrieved successfully',
      feedback: feedbackSummary
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('feedback_summary_error', duration, { error: error.message });

    res.status(500).json({
      error: 'Feedback summary retrieval failed',
      message: 'An error occurred while retrieving feedback summary'
    });
  }
});

// Submit user feedback (authenticated users)
router.post('/feedback', authenticateToken, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { sessionId, rating, feedbackText } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Invalid rating',
        message: 'Rating must be between 1 and 5'
      });
    }

    if (!feedbackText || feedbackText.trim().length === 0) {
      return res.status(400).json({
        error: 'Feedback text required',
        message: 'Please provide feedback text'
      });
    }

    // Save feedback
    await Feedback.save({
      userId: req.user.id,
      sessionId,
      rating,
      feedbackText: feedbackText.trim()
    });
    
    const duration = Date.now() - startTime;
    logPerformance('feedback_submission', duration, { rating, userId: req.user.id });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        rating,
        feedbackText: feedbackText.trim()
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('feedback_submission_error', duration, { error: error.message });

    res.status(500).json({
      error: 'Feedback submission failed',
      message: 'An error occurred while submitting feedback'
    });
  }
});

// Get user's own chat history (authenticated users)
router.get('/my-chats', authenticateToken, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // This would require additional database queries to get user's chat sessions
    // For now, return a placeholder response
    const duration = Date.now() - startTime;
    logPerformance('user_chat_history', duration, { userId: req.user.id });

    res.json({
      message: 'Chat history retrieved successfully',
      chats: [], // Placeholder - would need to implement chat history retrieval
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: 0
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('user_chat_history_error', duration, { error: error.message });

    res.status(500).json({
      error: 'Chat history retrieval failed',
      message: 'An error occurred while retrieving chat history'
    });
  }
});

// Export analytics data (admin only)
router.get('/export', authenticateToken, authorize(['admin']), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { format = 'json', startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Date range required',
        message: 'Please provide startDate and endDate parameters'
      });
    }

    const analyticsData = await Analytics.getAnalytics(startDate, endDate);
    const popularQueries = await Message.getPopularQueries(50);
    const feedbackSummary = await Feedback.getSummary();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: { startDate, endDate },
      analytics: analyticsData,
      popularQueries,
      feedback: feedbackSummary
    };

    const duration = Date.now() - startTime;
    logPerformance('analytics_export', duration, { format, startDate, endDate });

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${startDate}-to-${endDate}.csv"`);
      res.send('Date,Total Sessions,Total Messages,Unique Users\n' +
        analyticsData.map(day => `${day.date},${day.total_sessions},${day.total_messages},${day.unique_users}`).join('\n'));
    } else {
      res.json({
        message: 'Analytics data exported successfully',
        data: exportData
      });
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('analytics_export_error', duration, { error: error.message });

    res.status(500).json({
      error: 'Analytics export failed',
      message: 'An error occurred while exporting analytics data'
    });
  }
});

module.exports = router;


