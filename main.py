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


@app.route('/')
def index():    
	return login()

@app.route('/Project')
def login():
	return render_template("loginPage.html",**locals())

@app.route('/Project',methods =['POST'])
def login_post():	
	#username = request.form.get('username')
	email = request.form.get('email')
	password = request.form.get('password')
	user = function.login_check(email,password)
	if(user == -1):
		return jsonify({'status':'login_fail'})
	else:
		user_id = user[0]
		username = user[1]
		return jsonify({'status':'login_success','user_id':user_id,'username':username})

#register
@app.route('/Project/login',methods =['POST'])
def login_input():
	#username = request.form.get('username')
	email = request.form.get('email')
	password = request.form.get('password')
	user_id = function.login_check(email,password)
	if(user_id == -1):
		return jsonify({'status':'login_fail'})
	else:
		return jsonify({'status':'login_success','user_id':user_id})

@app.route('/Project/register',methods =['GET'])
def register():
	return render_template("Register.html",**locals())

@app.route('/Project/userpage',methods =['GET'])
def userpage():
	return render_template("UserPage.html",**locals())

@app.route('/Project/userpageinfo',methods =['POST'])
def userpage_info():
	user_id = request.form.get('user_id')
	return jsonify(function.userpage_info(user_id))

@app.route('/Project/changeName',methods =['POST'])
def change_name():
	user_id = request.form.get('user_id')
	username = request.form.get('username')
	function.change_name(user_id,username)
	return ""

@app.route('/Project/add_task',methods =['POST'])
def add_task():
	title = request.form.get('title')
	note = request.form.get('note')
	start_date = request.form.get('start_date')
	end_date = request.form.get('end_date')
	user_id = request.form.get('user_id')
	#print(end_date,str(end_date))
	function.add_task(user_id,title,note,start_date,end_date)
	return 'ok'

@app.route('/Project/add_group_task',methods =['POST'])
def add_group_task():
	title = request.form.get('title')
	note = request.form.get('note')
	start_date = request.form.get('start_date')
	end_date = request.form.get('end_date')
	user_id = request.form.get('user_id')
	group_id = request.form.get('group_id')
	#print(end_date,str(end_date))
	function.add_group_task(user_id,group_id,title,note,start_date,end_date)
	return 'ok'

@app.route('/Project/register_check',methods =['POST'])
def register_check():
	email = request.form.get('email')
	password = request.form.get('password')
	user_id = function.register(email,password)
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



@app.route('/Project/task',methods =['GET'])
def task():
	return render_template("Task.html",**locals())

@app.route('/Project/taskInfo',methods =['POST'])
def task_info():
	user_id = request.form.get('user_id')
	return jsonify(function.task_info(user_id))

@app.route('/Project/taskUpdate',methods =['POST'])
def task_update():
	task_id = request.form.get('task_id')
	status = request.form.get('status')
	print(task_id,status)
	function.task_update(task_id,status)
	return ""

@app.route('/Project/analysis',methods =['GET'])
def analysis():
	return render_template("Analysis.html",**locals())

@app.route('/Project/analysisInfo',methods =['POST'])
def analysis_info():
	user_id = request.form.get('user_id')
	return jsonify(function.analysis_info(user_id))

@app.route('/Project/groupPage',methods =['GET'])
def group_page():
	return render_template("GroupPage.html",**locals())

@app.route('/Project/groupPageInfo',methods =['POST'])
def group_page_info():
	group_id = request.form.get('group_id')
	return jsonify(function.group_page_info(group_id))

@app.route('/Project/create_group',methods =['POST'])
def create_group():
	user_id = request.form.get('user_id')
	group_name = request.form.get('group_name')
	function.create_group(user_id,group_name)
	return ""

@app.route('/Project/join_group',methods =['POST'])
def join_group():
	user_id = request.form.get('user_id')
	group_id = request.form.get('group_id')
	text = function.join_group(user_id,group_id)
	#print(text)
	return jsonify(text)

@app.route('/Project/group_task_info',methods =['POST'])
def group_task_info():
	group_id = request.form.get('group_id')
	user_id = request.form.get('user_id')
	return jsonify(function.group_task_info(user_id,group_id))

@app.route('/Project/group_task_update',methods =['POST'])
def group_task_update():
	task_id = request.form.get('task_id')
	user_id = request.form.get('user_id')
	group_id = request.form.get('group_id')
	status = request.form.get('status')
	#print(task_id,status)
	function.group_task_update(task_id,user_id,group_id,status)
	return ""

@app.route('/Project/leaderboard_info',methods =['POST'])
def leaderboard_info():
	group_id = request.form.get('group_id')
	return jsonify(function.leaderboard_info(group_id))

@app.route('/Project/leaderboard',methods =['GET'])
def leaderboard():
	return render_template("Leaderboard.html",**locals())

@app.route('/Project/add_comment',methods =['POST'])
def add_comment():
	group_id = request.form.get('group_id')
	text = request.form.get('text')
	time = request.form.get('time')
	function.add_comment(group_id,text,time)
	return "OK"


@app.route('/Project/comment_info',methods =['POST'])
def comment_info():
	group_id = request.form.get('group_id')
	return jsonify(function.comment_info(group_id))


if __name__ == "__main__":
	app.run()

