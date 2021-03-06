const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectType = new Schema({
  projectType: { type: String },
  projectType1: { type: String },
  projectType2: { type: String },
  isAcademicYear: { type: Boolean },
  isFirstYear: { type: Boolean },
  isSecondYear: { type: Boolean },
  isThirdYear: { type: Boolean },
  isFourthYear: { type: Boolean },
  isDeleted: { type: Boolean }
});

const ProjectType = mongoose.model('projectType', projectType);

module.exports = ProjectType;
