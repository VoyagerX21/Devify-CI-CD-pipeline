// Triggers a mock CI/CD pipeline based on GitHub event and payload
const triggerPipeline = async (event, payload) => {
    // Log event type and pipeline trigger
    console.log(`[${event.toUpperCase()}] CI/CD pipeline triggered!`);
    
    // Log relevant payload details for debugging
    console.log({
        repo: payload.repository?.full_name,
        pusher: payload.pusher?.name,
        message: payload.head_commit?.message
    });
};

// Export the triggerPipeline function
module.exports = { triggerPipeline };