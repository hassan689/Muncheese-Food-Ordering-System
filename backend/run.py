from app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()  # creates tables if not existing
            print("[SUCCESS] Database connection successful!")
        except Exception as e:
            print("[WARNING] Could not connect to database!")
            print(f"   Error: {str(e)}")
            print("   Please make sure PostgreSQL is running.")
            print("   The app will start, but database features won't work.")
    app.run(debug=True)
