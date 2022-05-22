from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask import request
from flask import jsonify

from flask import render_template
from bin.db_function import learning_project_function

app = Flask(__name__,template_folder='Templates',static_url_path='', 
            static_folder='')

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://test:test@localhost:3306/project_schema"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

function = learning_project_function(db)

@app.route("/test", methods=['GET'])
def getname():
    name = request.args.get('name')

    sql_cmd = """
        select Name
        from world.city
        where id = 1
        """

    query_data = db.engine.execute(sql_cmd)
    st = "<html> <h1>Result:</h1>"
    for i in query_data:
        st = st + i[0]
    st = st + "</html>"
    return st
    #return render_template("get.html",**locals())

@app.route('/')
def index():
    #return function.test_user()
    return 


@app.route('/from_somewhere')
def test():#receive request from here, calling other function and all the xml that need to collect
	return "test"

@app.route('/Project')
def login():
	return render_template("login_test.html",**locals())

@app.route('/Project/input',methods =['POST'])
def login_input():
	username = request.form.get('username')
	password = request.form.get('password')
	user_id = function.login_check(username,password)
	if(user_id == -1):
		return jsonify({'status':'login_fail'})
	else:
		return jsonify({'status':'login_success','user_id':user_id})

@app.route('/Project/userpage',methods =['GET'])
def userpage():
	return render_template("user_page.html",**locals())

@app.route('/Project/userpageinfo',methods =['POST'])
def userpage_info():
	user_id = request.form.get('user_id')
	return jsonify(function.userpage_info(user_id))

@app.route('/Project/addtask',methods =['POST'])
def add_task():
	title = request.form.get('title')
	user_id = request.form.get('user_id')
	function.add_task(user_id,title)
	return 'ok'

@app.route('/Project/register',methods =['POST'])
def register():
	username = request.form.get('username')
	password = request.form.get('password')
	user_id = function.register(username,password)
	if(user_id == -1):
		return jsonify({'status':'register_fail'})
	else:
		return jsonify({'status':'register_success','user_id':user_id})

@app.route('/Project/userAnalysis',methods =['GET'])
def userpage_analysis():
	return render_template("user_analysis.html",**locals())

@app.route('/Project/userAnalysisInfo',methods =['POST'])
def userpage_info_analysis():
	user_id = request.form.get('user_id')
	return function.user_analysis(user_id)

if __name__ == "__main__":
    app.run()

