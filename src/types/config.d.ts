export interface IConfigInterface {
  amqp: {
    url: string;
    myQueue: string;
    gatewayQueue: string;
    myService: string;
    gatewayService: string;
  };
  mongo: {
    url: string;
    db: string;
    testDb: string;
  };
  repository: string;
}
