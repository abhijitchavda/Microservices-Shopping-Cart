#### Pages

1. /payments {backend service using stripe to confirm successful payments}
2. /order   {backend service writing to db}

#### Charts

1. Payment made in last hour/month/year.
2. Total revenue generated hour/month/year.
3. Region with maximum payments.


#### Data Source

The above chart will use the following data and the chart.
> /payment

DB collection name: 
> "paymentactivitylogs"

Body:
> {
> "timestamp":<ISO format>,
> "username":<username>,
> "message":"<username>has successfully paid.",
> "amount":<totalcostpaid>
> "requestUrl":"/payments",
> "remoteIp":xxxxxxx
> }

