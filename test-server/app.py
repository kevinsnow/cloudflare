from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/headers', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def headers():
    # Get all headers from the request
    headers_dict = dict(request.headers)
    return jsonify(headers_dict)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
