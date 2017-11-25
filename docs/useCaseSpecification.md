#### Ninja 

The following are the core use cases for the Grocery ordering application.

##### Use Cases

|Sr.No|Use Case|Module|Description|
|-|-|-|-|
|1.|New User Registration|User Management|<ul> <li> User is directed to the sign up page </li> <li> User enters required details </li> <li> User is directed to the shopping cart on a new session after the details are recorded </li></ul>
|2. | Existing User login/logout|User Management|<ul><li>User is directed to the login page</li><li>User enters their ID and password</li><li>Id and password are validated</li><li>Successful login takes the user to the product catalog</li><li>Failure of validation takes the user back to the login page</li></ul>
|3. | Search Product Catalog|Product Catalog|<ul><li>Valid user can view the product catalog</li><li>User can switch between categories available in a left pane menu</li></ul>
|4. | Sort Products|Product Catalog|<ul><li>Valid user can select a sort option from the left pane menu</li><li>Sorting can be done based on price and ratings</li><li>User can specify the sorting order to be either ascending or descending</li></ul>
|5. | Add product to cart|Shopping cart|<ul><li>The user can click the *Add to cart* button which will add the product to the cart.</li><li>User can also click on the *Remove* button if they wish to remove the item from their shopping cart.</li></ul>
|6. | Checkout the product(Buy)|Shopping cart|<ul><li>If the user wishes to complete the shopping and proced to the payment he can click the *Checkout* button to proceed to the payment.</li></ul>
|7. | Make Payment| Payments | <ul><li>The *Payment* button will allow the user to complete the payment as per their choice.</li></ul>
|8. | Complete order process| Payments| <ul><li>Once the payment is successfully processed the user will receive an order id.</li></ul>
|9. | Logging data|Logging| <ul><li>The data events from the modules will be logged into the data store.</li></ul>
|10. | Data analytics|Logging| <ul><li>The dashboard will display various details for the grocery application.</li></ul>
