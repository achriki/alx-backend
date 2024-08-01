import sinon from "sinon";
import { expect } from "chai";
import { createQueue } from "kue";
import createPushNotificationsJobs from "./8-job";



describe('createPushNotificationsJobs', () => {
    const spy = sinon.spy(console)
    const queue = createQueue({name: 'push_notification_code_3'})

    before(() => {
        queue.testMode.enter(true)
    })

    afterEach(() => {
        spy.log.resetHistory()
    })

    after(() => {
        queue.testMode.clear()
        queue.testMode.exit()
    })
    
    it('displays an error message if jobs is not an array', () => {
        expect(
          createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, queue)
        ).to.throw('Jobs is not an array');
    });

    it('adds jobs to the queue with the correct type', (done) => {
        expect(queue.testMode.jobs.length).to.equal(0)
        const jobInfos = [
            {
              phoneNumber: '44556677889',
              message: 'Use the code 1982 to verify your account',
            },
            {
              phoneNumber: '98877665544',
              message: 'Use the code 1738 to verify your account',
            },
        ];

        createPushNotificationsJobs(jobInfos, queue)
        expect(queue.testMode.jobs.length).to.equal(2)
        expect(queue.testMode.jobs[0].data).to.deep.equal(jobInfos[0])
        expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3')
        
        queue.process('push_notification_code_3', ()=>{
            expect(spy.log.calledWith.apply('Notification job created:', QUEUE.testMode.jobs[0].id).to.be.true)
        })

        done()
    })
})