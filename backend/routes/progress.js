const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const Projects = require('../models/projects');
const ProgressTasks = require('../models/progresstasks');
const User = require('../models/users');
const ProgressUpdates = require('../models/progressupdates');


//add project tasks
router.post('/addtask', verify, async (req, res, next) => {
    try {
        const groupMembers = req.body.groupMembers
        const studentIds = await User.find({indexNumber:groupMembers}).select('_id');
        let studentList = []
        let progressList = []
        for(let i in studentIds){
            progressList.push(0)
            studentList.push(studentIds[i]._id)
        }
        const project = new ProgressTasks(req.body);
        project.studentList = studentList
        project.studentProgress = progressList
        const result = await project.save();
        res.send(result);
    }
    catch (err) {
        console.log(err)
    }
})
//edit progresstasks
router.patch('/edittask/:id',verify,async(req,res,next)=>{
    try{
        const id = req.params.id;
        const obj = req.body;
        const result = await ProgressTasks.findByIdAndUpdate(id,  obj,{ new: true })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})
//delete task by taskId
router.delete('/deletetask/:id',verify,async(req,res,next)=>{
    try{
        const id = req.params.id;
        const result = await ProgressTasks.findOneAndDelete({_id:id})
        const result2 = await ProgressUpdates.find({taskId: id})
        result2.map(async (item)=>{
            await ProgressUpdates.findOneAndDelete({taskId: id})
        })
        res.send(result2)
    }
    catch (e) {
        console.log(e)
    }
})

//get project tasks
router.get('/gettasks/:id',async(req,res,next) =>{
    try {
        const groupId = req.params.id
        const result = await ProgressTasks.find({groupId:groupId}).sort({ totalProgress: -1 })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//get task details from taskId
router.get('/gettaskdetails/:id',async(req,res,next) =>{
    try {
        const id = req.params.id
        const result = await ProgressTasks.findOne({_id:id})
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

//get total progress of a group
router.get('/gettotalprogress/:groupId', async(req,res,next) =>{
    try{
        const groupId = req.params.groupId
        const tasks = await ProgressTasks.find({groupId:groupId})
        let percentSum=0;
        let totalWeight=0;
        for(let i in tasks){
            percentSum = percentSum + tasks[i].totalProgress*tasks[i].taskWeight
            totalWeight = totalWeight + tasks[i].taskWeight
        }
        const totalProgress = percentSum/totalWeight
        var string  = ""+Math.round(totalProgress * 100) / 100
        if(tasks.length==0){
            string = ""+0
        }
        res.send(string)
    }
    catch (e) {
        console.log(e)
    }
} )

//get total progress of a student
router.post('/getstudenttotalprogress/:studentIndex', async(req,res,next) =>{
    try{
        const index = req.params.studentIndex
        const groupId = req.body.groupId
        const userId = await User.findOne({indexNumber:index}).select('_id');
        const tasks = await ProgressTasks.find({studentList:userId._id, groupId:groupId})
        let progress = 0;
        let totalWeight = 0;
        for(let i in tasks){
            let index = -1;
            for(let j in tasks[i].studentList){ //get the array index of student
                if(tasks[i].studentList[j] == userId._id){
                    index = userId._id
                    let individualProgress = tasks[i].studentProgress[j]; // individual progress of the student
                    let taskTotalProgress = tasks[i].totalProgress; // task total progress
                    let individualContribution = individualProgress * tasks[i].taskWeight ;  // calculating individual contribution
                    // let individualContribution = individualProgress*taskTotalProgress/100.00 * tasks[i].taskWeight ;  // calculating individual contribution
                    progress = progress + individualContribution;
                    totalWeight = totalWeight + tasks[i].taskWeight;
                }
            }
        }
        let studentProgress = progress/totalWeight;
        res.send(""+studentProgress);
    }
    catch (e) {
        console.log(e)
    }
} )

//get task progress of a student
router.post('/getstudenttaskprogress/:studentIndex', async(req,res,next) =>{
    try{
        const index = req.params.studentIndex
        const taskId = req.body.taskId
        const userId = await User.findOne({indexNumber:index}).select('_id');
        const task = await ProgressTasks.findOne({studentList:userId._id,_id:taskId})
        let studentProgress = 0;
        for(let j in task.studentList){ //get the array index of student
            if(task.studentList[j] == userId._id){
                studentProgress = task.studentProgress[j]; // individual progress of the student
            }
        }
        res.send(""+studentProgress);
    }
    catch (e) {
        console.log(e)
    }
} )

//update the progress
router.post('/addprogressupdate', verify, async (req, res, next) => {
    try {

        const obj2 = req.body

        //update task prgress & student progress
        const userId = req.body.userId;
        const taskId = req.body.taskId;
        const progressChange = req.body.progressChange
        let prevStudentProgress = 0;
        let studentIndex = -1

        const task = await ProgressTasks.findOne({_id: taskId});
        let prevTotalProgress = task.totalProgress;
        for(let j in task.studentList){ //get the array index of student
            if(task.studentList[j] == userId){
                studentIndex = j;
                prevStudentProgress = task.studentProgress[j]; // individual progress of the student
            }
        }
        let newProgress = prevStudentProgress + progressChange; // student new progress
        let totalProgress = 0;

        if(newProgress<0){ // if student reduce progress more than his current progress
            newProgress=0
            totalProgress = prevTotalProgress - prevStudentProgress;
            obj2.progressChange = -1 * prevStudentProgress
        }
        else{
            totalProgress = prevTotalProgress + progressChange; // task new progress
        }
        let studentProgress = task.studentProgress;
        studentProgress[studentIndex] = newProgress;

        const obj = {
            totalProgress: totalProgress,
            studentProgress : studentProgress
        }
        const result = await ProgressTasks.findByIdAndUpdate(taskId,  obj,{ new: true })

        const project = new ProgressUpdates(obj2);
        const result2 = await project.save();
    }
    catch (err) {
        console.log(err)
    }
})

//get progress updates by project ID
router.get('/getprojectprogressupdates/:groupId',async(req,res,next) =>{
    try {
        const groupId = req.params.groupId
        const result = await ProgressUpdates.find({groupId:groupId}).sort({ timestamp: -1 })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

router.get('/getprojectprogressupdates/:groupId',async(req,res,next) =>{
    try {
        const groupId = req.params.groupId
        const result = await ProgressUpdates.find({groupId:groupId}).sort({ timestamp: -1 })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

router.get('/gettaskprogressupdates/:taskId',async(req,res,next) =>{
    try {
        const taskId = req.params.taskId
        const result = await ProgressUpdates.find({taskId:taskId}).sort({ timestamp: -1 })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

module.exports = router;