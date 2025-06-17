const triggerPipeline = async (event, payload) => {
    console.log(`[${event.toUpperCase()}] CI/CD pipeline triggered!`);
    console.log({
        repo: payload.repository?.full_name,
        pusher: payload.pusher?.name,
        message: payload.head_commit?.message
    });
};

module.exports = { triggerPipeline }