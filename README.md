# ToDo List App
![ToDo List App Banner](https://is3.cloudhost.id/eventnimz-jktstrg/eventnimz-jktstrg/arcastorage/todo-banner.png)
Welcome to the ToDo List App! This application is built using **Next.js** and **PostgreSQL**, and is hosted at [todo.arcanius.id](https://todo.arcanius.id). In the future, we plan to implement **TimescaleDB** and support many interesting features.

## Features

- **Mobile Responsive Web**: Access your to-do list on any device with a seamless experience.
- **Session Sharing**: Share sessions across devices for a consistent experience.
- **User Authentication**: Secure login and session management.
- **ToDo List Copy Sharing**: Share your to-do lists with others.
- **Task Management**: Set start and end dates for tasks, add affirmations, and modify your to-do lists.
- **Calendar View**: Visualize your tasks in a calendar format.
- **New! Filter**: Filter your tasks based on the status!

## Future Enhancements

- **TimescaleDB Integration**: Enhance performance and scalability with TimescaleDB.
- **Additional Features**: More exciting features to come!

## Getting Started

### Prerequisites

- **Node.js** and **npm** or **yarn**
- **PostgreSQL** database

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/hafidzmrizky/todo
    cd todo
    ```

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up PostgreSQL database**:
    - Create a new PostgreSQL database.
    - Set the following environment variables in a `.env` file:
        ```env
        DB_HOST=localhost
        DB_PORT=5432
        DB_DATABASE=your_database_name
        DB_USER=your_database_username
        DB_PASSWORD=your_database_password
        ```

### Running the App

1. **Start the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000).

## Contributing

We welcome contributions! Please fork the repository and submit pull requests.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact us at support@arcanius.id.

---

Thank you for using the ToDo List App! We hope it helps you stay organized and productive.
