const express = require('express')
const jwt = require('jsonwebtoken')
const redis = require('redis')

const app = express()
const redisClient = redis.createClient({ url: process.env.REDIS_URL })

app.post('/auth/transition-token', async (req, res) => {
  const { userId, onboardingStatus } = req.body
  
  // Create a special transition token
  const transitionToken = jwt.sign({
    userId,
    onboardingStatus,
    type: 'transition',
    exp: Math.floor(Date.now() / 1000) + (5 * 60) // 5 minutes
  }, process.env.JWT_SECRET)
  
  // Store in Redis for validation
  await redisClient.set(`transition:${userId}`, transitionToken, {
    EX: 300 // 5 minutes expiration
  })
  
  res.json({ transitionToken })
})

// Validate transition when user arrives at main platform
app.post('/auth/validate-transition', async (req, res) => {
  const { transitionToken } = req.body
  
  try {
    // Verify token
    const decoded = jwt.verify(transitionToken, process.env.JWT_SECRET)
    
    // Check Redis
    const storedToken = await redisClient.get(`transition:${decoded.userId}`)
    if (storedToken !== transitionToken) {
      throw new Error('Invalid transition')
    }
    
    // Create new session token for main platform
    const sessionToken = jwt.sign({
      userId: decoded.userId,
      type: 'session'
    }, process.env.JWT_SECRET)
    
    // Clean up transition token
    await redisClient.del(`transition:${decoded.userId}`)
    
    res.json({ sessionToken })
  } catch (error) {
    res.status(401).json({ error: 'Invalid transition' })
  }
})

app.listen(4000, () => console.log('Auth service running on port 4000'))
