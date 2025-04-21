const Task = require("../models/task.model");

const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");
const { search } = require("../routes/task.route");

//[GET] api/v1/tasks/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if (req.query.keyword) {
    find.title = objectSearch.regex;
  };

  //Pagination
  const initPagination = {
    currentPage: 1,
    limitItems: 2
  };

  const countTasks = await Task.countDocuments(find);

  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );

  //END Pagination

  //Sort
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  };
  //END Sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.json(tasks);
};

//[GET] api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false
    });

    res.json(task);
  } catch (error) {
    res.json("Không tìm thấy");
  }
};

//[PATCH] api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try{
      const id = req.params.id;
      const status = req.body.status;
  
      await Task.updateOne({
        _id: id
      },{
        status: status
      });
  
      res.json({
        code: 200,
        message: "Cập nhật trạng thái thành công!"
      });
    }
    catch(error){
      res.json({
        code: 400,
        message: "khong ton tai!"
      });
    }
};


