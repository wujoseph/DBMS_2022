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

	def login_check(self,email,password):
		sql_cmd = """
		select *
		from user
		"""
		query_data = self.db.engine.execute(sql_cmd)
		for i in query_data:
			if(email == i[3] and password == i[2]):
				return [i[0],i[1]]#return user id,username
		return -1

#return list: [[group name,group id]]
	def userpage_info(self,user_id):
		sql_cmd = """
		select *
		from learning_group
		where User_ID = """+str(user_id)
		query_data = self.db.engine.execute(sql_cmd)
		return_info = []
		for i in query_data:
			return_info.append({'name':i[1],'id':i[0]})
		#print(return_info)
		return return_info

#task info
	def task_info(self,user_id):
		sql_cmd = """
		select *
		from task
		where User_ID = """+str(user_id) +" and Group_ID is null" 
		return_list = []
		query_data = self.db.engine.execute(sql_cmd)
		for i in query_data:
			di = {}
			di['task_id'] = i[0]
			di['title'] = i[4]
			di['description'] = i[7]
			di['start_date'] = str(i[5])
			di['end_date'] = str(i[6])
			di['status'] = i[3]
			return_list.append(di)
		return_list = sorted(return_list,key = lambda x:x['end_date'],reverse = True)
		#print(return_list)
		return return_list

	def group_task_info(self,user_id,group_id):
		sql_cmd = """
		select *
		from task
		where Group_ID = """+str(group_id)+" and user_id = "+str(user_id)
		return_list = []
		query_data = self.db.engine.execute(sql_cmd)
		for i in query_data:
			di = {}
			di['task_id'] = i[0]
			di['title'] = i[4]
			di['description'] = i[7]
			di['start_date'] = str(i[5])
			di['end_date'] = str(i[6])
			di['done_number'] = i[2]
			di['status'] = i[3]
			return_list.append(di)
		return_list = sorted(return_list,key = lambda x:x['end_date'],reverse = True)
		#print(return_list)
		return return_list

	def group_task_update(self,task_id,user_id,group_id,status):
		sql_cmd = """
		select *
		from task
		where Task_ID = """+str(task_id)
		query_data = self.db.engine.execute(sql_cmd)
		num = query_data.first()[2]#Done_Number

		if(int(status) == 0):
			diff = -1
		else:
			diff = 1
		#print(status,num,diff,num+diff)
		#update all the Done_Number with same Task_ID
		sql_cmd = """
		update task
		set Done_Number = """ + str(num+diff) +"""
		where Task_ID = """+str(task_id)
		query_data = self.db.engine.execute(sql_cmd)
		
		sql_cmd = """
		update task
		set status = """ + str(status) +"""
		where Task_ID = """+str(task_id) + " and User_ID = " + user_id
		query_data = self.db.engine.execute(sql_cmd)


	#personal task
	def task_update(self,task_id,status):
		sql_cmd = """
		update task
		set status = """ + str(status) +"""
		where Task_ID = """+str(task_id)
		query_data = self.db.engine.execute(sql_cmd)

	#get available task_id that hadn't been used
	def task_id_get(self):
		sql_cmd = """
		select *
		from task
		order by task_id desc"""
		query_data = self.db.engine.execute(sql_cmd)
		return query_data.first()[0]+1

	#personal task
	def add_task(self,user_id,title,note,start_date,end_date):
		task_id = self.task_id_get()
		#insert into task values(null,1,null,1,'flusk design','2022-05-08');
		sql_cmd = "insert into task values("+str(task_id) + "," + str(user_id) +",null,0,'"+title + "','" + str(start_date) + "','" + str(end_date) + "','" + note + "',null);"
		print(sql_cmd)
		self.db.engine.execute(sql_cmd)

	#group task
	def add_group_task(self,user_id,group_id,title,note,start_date,end_date):
		#create group task for all the user in the group
		task_id = self.task_id_get()

		group_li = self.group_page_info(group_id)[1]
		for member_id in group_li:
			#insert into task values(null,1,null,1,'flusk design','2022-05-08');
			sql_cmd = "insert into task values("+str(task_id) + "," + str(member_id) +",0,0,'"+title + "','" + str(start_date) + "','" + str(end_date) + "','" + note + "'," + group_id + ");"
			print(sql_cmd)
			self.db.engine.execute(sql_cmd)


	def register(self,email,password):
		sql_cmd = """
		select *
		from user
		where email ='""" + email + "'"
		query_data = self.db.engine.execute(sql_cmd)
		count = 0
		for i in query_data:
			if(i[0] != None):
				#print(i[0])
				count = count + 1
		#print(count)
		if(count == 0):
			sql_cmd = "insert into user values(null,'username', '" + password + "','" + email + "');"
			query_data = self.db.engine.execute(sql_cmd)
			print(query_data)
			return self.login_check(email,password)#return user_id
		else:
			return -1

	def analysis_info(self, user_id):
		#task : Objective_ID INTEGER , Owner_ID INTEGER,Done_Number INTEGER, Status INTEGER,Title VARCHAR(20), Date Date 
		sql_cmd = """
		select *
		from task
		where User_ID=""" + user_id + " and Group_ID is null" +"""
		order by End_Date DESC"""
		query_data = self.db.engine.execute(sql_cmd)
		data = {}
		complete = 0
		total = 0
		for i in query_data:
			total = total + 1
			if(str(i[6]) not in data):
				if(i[3] == 1):
					data[str(i[6])] = [1,1]
					complete += 1
				else:
					data[str(i[6])] = [0,1]
			else:
				data[str(i[6])][1] = data[str(i[6])][1] + 1
				if(i[3] == 1):
					data[str(i[6])][0] = data[str(i[6])][0] + 1
					complete += 1
				#else:
		for i in data:
			data[i].append("{0:.0%}".format(data[i][0]/data[i][1]))
		#print(data)
		data['total'] = [complete,total]
		#print(data)
		return data



	def change_name(self,user_id,username):
		sql_cmd = """
		update user
		set Username ='""" + username + """'
		where User_ID =""" + user_id
		self.db.engine.execute(sql_cmd)

		
	def group_page_info(self,group_id):
		sql_cmd = """
		select u.User_ID, u.Username
		from learning_group as l, user as u
		where l.User_ID = u.User_ID AND l.Group_ID =""" + group_id
		data = self.db.engine.execute(sql_cmd)		
		group_member = {}
		return_list = []
		for i in data:
			group_member[i[0]] = i[1]

		sql_cmd = """
		select Group_Name
		from learning_group
		where Group_ID=""" + group_id
		data = self.db.engine.execute(sql_cmd)
		group_name = data.first()[0]
		return_list.append(group_name)
		return_list.append(group_member)
		print(return_list)
		return return_list

	def create_group(self,user_id,group_name):
		#print(user_id,group_name)
		sql_cmd = """
		select *
		from learning_group;"""
		data = self.db.engine.execute(sql_cmd)
		max_id = 0
		for i in data:
			max_id = max(max_id,i[0])
		#max_id_str = str(max_id)

		sql_cmd = "insert into learning_group values("+str(max_id+1)+",'"+group_name+"',"+user_id+");"
		self.db.engine.execute(sql_cmd)

	def join_group(self,user_id,group_id):
		sql_cmd = """
		select *
		from learning_group
		where User_ID="""+user_id+" AND Group_ID="+group_id
		data = self.db.engine.execute(sql_cmd)
		first = data.first()
		if(first != None):
			return "exist"
		

		sql_cmd = """
		select *
		from learning_group
		where Group_ID="""+group_id
		data = self.db.engine.execute(sql_cmd)
		first = data.first()
		if(first == None):
			return "not exist"

		group_name = first[1]
		sql_cmd = "insert into learning_group values("+group_id+",'"+group_name+"',"+user_id+");"
		self.db.engine.execute(sql_cmd)

		#insert all the task in that group
		sql_cmd = """ select distinct task_ID, done_number,title,start_date,end_date,description
		from task
		where Group_ID = """ + group_id;
		data = self.db.engine.execute(sql_cmd)
		for i in data:
			task_id = i[0]
			done_number = i[1]
			title = i[2]
			start_date = i[3]
			end_date = i[4]
			note = i[5]
			sql_cmd = "insert into task values("+str(task_id) + "," + str(user_id) +","+ str(done_number) +",0,'"+title + "','" + str(start_date) + "','" + str(end_date) + "','" + note + "'," + group_id + ");"
			print(sql_cmd)
			self.db.engine.execute(sql_cmd)

		return "success"

	def leaderboard_info(self,group_id):
		sql_cmd = """
		select t.*, u.username
		from task as t,user as u
		where t.Group_ID = """ + group_id + " and u.User_ID = t.User_ID;"
		data = self.db.engine.execute(sql_cmd)
		#test
		#print(data.first())
		user = {}
		for i in data:
			#print(i)
			if(i[1] not in user):
				user[i[1]]= [i[3],1,i[9],i[1]]#status,1,name,id
			else:
				#print(user[i[1]])
				user[i[1]][1]= user[i[1]][1] + 1
				if(i[3] == 1):
					user[i[1]][0] = user[i[1]][0] + 1
		for i in user:
			status = user[i][0]
			total = user[i][1]
			user[i].append("{0:.0%}".format(status/total))
		if(len(user) == 0):#bug due to no task
			member_di = self.group_page_info(group_id)[1]
			for i in member_di:
				user[i] = [0,0,member_di[i],i,"N/A"]
		#print(user)
		return_list = [k for v,k in sorted(user.items(), key=lambda item: item[1][0],reverse=True)] 
		print(return_list)
		return return_list

	def add_comment(self,group_id,text,time):
		sql_cmd = "insert into comment values(null,"+str(group_id) + ",'" + str(time) + "','" + text + "');"
		print(sql_cmd)
		self.db.engine.execute(sql_cmd)

	def comment_info(self,group_id):
		sql_cmd = """
		select *
		from comment
		where group_id = """ + str(group_id) + """
		order by id"""
		data = self.db.engine.execute(sql_cmd)
		return_list = []
		for i in data:
			return_list.append([str(i[3]),str(i[2])])
		print(return_list)
		return return_list

	def leaderboard_insert(self,user_id,group_id,num):
		sql_cmd = "insert into leaderboard values(" + str(user_id) + "," + str(group_id) + ","+ str(num) + ")"
		self.db.engine.execute(sql_cmd)

	def leaderboard_update(self):
		sql_cmd = "select distinct group_id from learning_group;"
		data = self.db.engine.execute(sql_cmd)
		group_li = []
		for i in data:
			group_li.append(int(i[0]))
		print(group_li)

		for i in group_li:
			lead_info = self.leaderboard_info(str(i))
			for j in lead_info:
				self.leaderboard_insert(j[3],i,j[0])
