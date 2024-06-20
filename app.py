from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
db = SQLAlchemy(app)

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    details = db.Column(db.Text)

@app.route('/cars', methods=['GET'])
def get_cars():
    if 'year' in request.args:
        year = int(request.args['year'])
        cars = Car.query.filter_by(year=year).all()
    else:
        cars = Car.query.all()
    output = [{'model': car.model, 'year': car.year, 'details': car.details} for car in cars]
    return jsonify({'cars': output})

if __name__ == '__main__':
    app.run(debug=True)
