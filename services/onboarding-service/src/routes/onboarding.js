const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const logger = require('../config/logger');
const TransitionHandler = require('../handlers/transitionHandler');

const transitionHandler = new TransitionHandler(db.pool);

// Get onboarding status
router.get('/status/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.query(
            'SELECT onboarding_completed, onboarding_step, onboarding_data FROM users WHERE id = $1',
            [userId]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'User not found' });
        }

        logger.info('Status checked', { userId, status: result.rows[0] });
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error checking status', { userId: req.params.userId, error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update onboarding step
router.post('/step/:userId', auth, async (req, res) => {
    const { userId } = req.params;
    const { step, stepData } = req.body;

    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        // Update step and step data
        await client.query(
            `UPDATE users 
             SET onboarding_step = $1, 
                 onboarding_data = onboarding_data || $2::jsonb 
             WHERE id = $3`,
            [step, JSON.stringify(stepData), userId]
        );

        await client.query('COMMIT');
        logger.info('Step updated', { userId, step, stepData });
        res.json({ success: true });
    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Error updating step', { userId, error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Complete onboarding
router.post('/complete/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Finalize onboarding
        await transitionHandler.finalizeOnboarding(userId);
        
        // Create transition token
        const transitionToken = await transitionHandler.createTransitionToken(userId);
        
        // Generate redirect URL with token
        const redirectUrl = new URL(process.env.MAIN_APP_URL);
        redirectUrl.searchParams.append('transition_token', transitionToken);
        
        logger.info('Onboarding completed', { userId });
        res.json({ 
            success: true,
            redirectUrl: redirectUrl.toString()
        });
    } catch (error) {
        logger.error('Error completing onboarding', { 
            userId: req.params.userId, 
            error: error.message 
        });
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
