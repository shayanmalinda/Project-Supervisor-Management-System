const express = require('express');
const router = express.Router();
const verify = require('../authentication');
const Projects = require('../models/projects');
const User = require('../models/users');
const BiweekSubmissions = require('../models/biweeksubmissions');
const CreateGroups = require('../models/createGroups');

//get biweek submissions by supervisorId
router.get("/getsubmissions/:id",async(req,res) => {
    try{
        const userId = req.params.id
        console.log(userId)
        const groups = await CreateGroups.find({supervisors: userId, groupState: true}).select("_id")
        let groupIdList = []
        groups.map(item => {
            groupIdList.push(item._id)
        })

        const allSubmissions = await BiweekSubmissions.find({groupId: groupIdList, supervisors: userId})

        let result = []

        allSubmissions.map(item=>{
            for (index in item.supervisors){
                if(item.supervisors[index]===userId){
                    if(item.status[index]==="Pending"){
                        result.push(item)
                    }
                }
            }

        })
        res.send(result)
    }
    catch(e){
        console.log(e)
    }
})

module.exports = router;