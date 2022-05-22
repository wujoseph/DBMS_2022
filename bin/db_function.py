from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

class learning_project_function:
	def __init__(self,db):
		self.db = db

	def test_user(self):
		sql_cmd = """
		select *
		from user
		"""

		query_data = self.db.engine.execute(sql_cmd)
		st = "<html> <h1>Result:</h1>"
		for i in query_data:
			row = ""
			for k in i:
				row = row + str(k) + " "
			st = st + row +"<br>"
		st = st + "</html>"
		return st


	def user_page(self,user_id):
		sql_cmd = """
		select *
		from user
		"""

		query_data = self.db.engine.execute(sql_cmd)
		st = "<html> <h1>Result:</h1>"
		for i in query_data:
			row = ""
			for k in i:
				row = row + str(k) + " "
			st = st + row +"<br>"
		st = st + "</html>"
		return st

	def login_check(self,username,password):
		sql_cmd = """
		select *
		from user
		"""
		query_data = self.db.engine.execute(sql_cmd)
		for i in query_data:
			if(username == i[1] and password == i[2]):
				return i[0]
		return -1

	def userpage_info(self,user_id):
		sql_cmd = """
		select *
		from task
		where Owner_ID = """+str(user_id)

		tasks = []
		complete = 0
		left = 0
		query_data = self.db.engine.execute(sql_cmd)
		for i in query_data:
			tasks.append({'title':i[4],'status':i[3]})
			if(i[3] == 1):
				complete = complete + 1
			else:
				left = left + 1
		return_info = {'complete':complete,'left':left, 'tasks':tasks}
		print(return_info)
		return return_info

	def add_task(self,user_id,title):
		now = datetime.now()
		date_time = now.strftime("%Y-%m-%d")
		#insert into task values(null,1,null,1,'flusk design','2022-05-08');
		sql_cmd = "insert into task values(null," + str(user_id) +",null,0,'"+title + "','" + str(date_time) + "');"
		print(sql_cmd)
		self.db.engine.execute(sql_cmd)

	def register(self,username,password):
		sql_cmd = """
		select *
		from user
		where username ='""" + username + "'"
		query_data = self.db.engine.execute(sql_cmd)
		count = 0
		for i in query_data:
			if(i[0] != None):
				#print(i[0])
				count = count + 1
		#print(count)
		if(count == 0):
			sql_cmd = "insert into user values(null,'" + username + "', '" + password + "');"
			query_data = self.db.engine.execute(sql_cmd)
			return self.login_check(username,password)#return user_id
		else:
			return -1

	def user_analysis(self, user_id):
		#task : Objective_ID INTEGER , Owner_ID INTEGER,Done_Number INTEGER, Status INTEGER,Title VARCHAR(20), Date Date 
		sql_cmd = """
		select *
		from task
		where Owner_ID=""" + user_id + """
		order by Owner_ID DESC"""
		query_data = self.db.engine.execute(sql_cmd)
		data = {}
		for i in query_data:
			if(str(i[5]) not in data):
				if(i[3] == 1):
					data[str(i[5])] = [1,1]
				else:
					data[str(i[5])] = [0,1]
			else:
				data[str(i[5])][1] = data[str(i[5])][1] + 1
				if(i[3] == 1):
					data[str(i[5])][0] = data[str(i[5])][0] + 1
				#else:
		for i in data:
			data[i].append("{0:.2%}".format(data[i][0]/data[i][1]))
		return data




		
