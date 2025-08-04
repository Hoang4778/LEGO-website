# LEGO website

This is a final exam project for the Web development subject. It is a simple E-commerce website selling LEGO toys, with the website for buyers to browse products, and the admin panel for store owner to manage data.

## Features
- Customers can browse the products.
- Products on the website can be searched via the search bar.
- Customers can place orders based off the available products on the website.
- Admin can manage products, orders and customers information from the admin panel.

## Installation

### Prerequisites
- Dotnet version 8.0

### Walkthough
1. Step 1: Clone the repo to your local machine
```bash
git clone https://github.com/Hoang4778/LEGO-website.git
```

2. Step 2: Checkout to the "development" branch before starting the project

3. Step 3: In your SQL Server, create a database named "LegoWebsite", and import the file "LegoWebsite - Database.sql" from the project root directory

4. Step 4: Start the project by running the following command or click the Run button at the top of your IDE if you are using Visual Studio:
```bash
dotnet run
```

## Usage
1. For customer user: Start at the home page and navigate around to see the whole website.
2. For administrator:
- Navigate to the route "/admin".
- Type in the login info (You will find the admin account in the database at table "AdminAccount") and hit "Log in".
- Navigate from the home page of the admin panel to see the store data.
