import { Queue, Job } from 'kue';

const createPushNotificationsJobs = (jobs, queue) => {
    if(!(jobs instanceof Array)){
        throw new Error('Jobs is not an array')
    }

    for (const job of jobs) {
        const jobQueue = queue.create('push_notification_code_3', job)

        jobQueue
            .on('enqueue', () => {
                console.log(`Notification job created: ${jobQueue.id}`)
            })
            .on('complete', () => {
                console.log(`Notification job ${jobQueue.id} completed`)
            })
            .on('failed', (errorMessage) => {
                console.log(`Notification job JOB_ID failed: ${errorMessage}`)
            })
            .on('progress', (progress, _data) => {
                console.log(`Notification job ${jobQueue.id} ${progress}% complete`)
            })
        jobQueue.save()
    }
}

export default createPushNotificationsJobs
module.exports = createPushNotificationsJobs