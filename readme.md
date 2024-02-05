# Task 1: Setting Up the Environment

- Set up a basic Node.js project with Express.js as the web framework, Mongodb as the database, and mongoose or mongod as the ORM. - install Dependency and set up Folder , and ERROR and Response Handeller

# Task 2: User and Orders Models

Create Mongoose models and schemas for the following collections: "Users" collection with the following fields:

- \_id (Primary Key, Auto-generated)
- username (String, Unique)
- email (String, Unique)
- createdAt (Timestamp)
- updatedAt (Timestamp)
  "Orders" collection with the following fields:
- \_id (Primary Key, Auto-generated)
- userId (Foreign Key referencing Users.id)
- totalAmount (Decimal)
- createdAt (Timestamp)
- updatedAt (Timestamp)

# Task 3: Create Register and Login feature :

- Create the login and register API endpoints
- Make use of JWT
- Hash the password

# Task 4: CRUD Operations

Implement CRUD operations for both Users and Orders and use JWT token for authorization : For Users:

- Create a new user.
- Retrieve a list of all users with their associated orders.
- Retrieve a single user by their ID along with their orders.
- Update a user's information (username or email) by their ID.
- Delete a user by their ID.

# For Orders:

- Create a new order for a specific user.
- Retrieve all orders for a specific user.
- Retrieve a single order by its ID.
- Update an order's total amount by its ID.
- Delete an order by its ID.

# Task 5: Aggregation

Create a route to retrieve the total revenue generated from all orders. Note - Use the native mongoose $sum aggregation function to calculate the total revenue.

# Task 6: Submission

Push your code to a public repository on your github profile and share the link with us.
