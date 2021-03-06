var express = require('express')
var userRoutes = express.Router()
var TestUsers = require('./Users')
var crypto = require('crypto')
var path = require('path')

var axios = require('axios')

const dotenv = require('dotenv')

let fs = require('fs-extra')

var multer  = require('multer')

var async = require("async")

// v2
const csv=require("csvtojson");

const asyncHandler = require('express-async-handler')

var storage = multer.diskStorage({
    destination: function(req, file, callback){
      let fpath = `./uploads/`
        fs.mkdirsSync(fpath)
        callback(null, fpath)
    },
    filename: function(req, file, callback){
        callback(null, new Date() + "-" + "test" + path.extname(file.originalname))
    }
})

var upload = multer({storage: storage})

var readXlsxFile = require('read-excel-file/node')

var XLSX = require('xlsx')

// We are using the dotenv library to load our environmental variables from the .env file.
dotenv.load();


const env = {
  FourIQ_BaseURL: process.env.FourIQ_BaseURL,
  FourIQ_USERNAME: process.env.FourIQ_USERNAME,
  FourIQ_TOKEN: process.env.FourIQ_TOKEN,
  FourIQ_APPTOKEN: process.env.FourIQ_APPTOKEN
};

API = axios.create({
  baseURL: env.FourIQ_BaseURL,
  headers: { 'X-Username': env.FourIQ_USERNAME, 'X-Token': env.FourIQ_TOKEN, 'X-AppToken': env.FourIQ_APPTOKEN, 'Content-Type': 'application/json' }
})

function getPercent(percentFor,percentOf)
{
    return Math.floor(percentFor/percentOf*100);
}

const getNextResult = async (query, item, returnData, fileName) => {

  let total = returnData.breach_info.query.pagination.total
  let count = returnData.breach_info.query.pagination.count
  let page = returnData.breach_info.query.pagination.page

  let numPages = Math.ceil(total / 10)

  let nextId = returnData.breach_info.next_id

  const resp = await API.post('search', query)

  returnData = { user: item.User, breach_info: resp.data.data }
  fs.writeFile("./uploads/" + fileName, JSON.stringify(returnData), { flag: "a" }, function(err) {
      if(err) {
        console.log(err)
      }
  })

  page = returnData.breach_info.query.pagination.page
  nextId = returnData.breach_info.next_id

  console.log(page)
  console.log(numPages)

  let data = { email: item.User.Email, next_id: nextId }
  let postdata = JSON.stringify(data)

  if(page < (numPages-1)) {
    getNextResult(postdata, item, returnData, fileName)
  } else {
      return { returnData }
  }
}


// get a test
userRoutes.route('/test').get(function(req, res, next) {

  var jResp = { response: 'test', api: { method: req.method, url: req.protocol + '://' + req.hostname + req.baseUrl, status: 200, response: 'test' } }
  res.json(jResp);
})

userRoutes.route('/bulkDomainSearch').post(upload.single('files'), function(req, res, next) {

  const schema = {
    'Sequence #': {
      prop: 'sequenceNumber',
      type: String
    },
    'Domain': {
      prop: 'domainName',
      type: String
    }
  }

  console.log('------- file json: ' + JSON.stringify(req.file));

  let wb = XLSX.utils.book_new();

  console.log('about to read...')
  readXlsxFile(req.file.path, { schema }).then(({ rows, errors }) => {
    // `errors` have shape `{ row, column, error, value }`.
    // errors.length === 0
    console.log(errors)
    console.log(rows)

      async.mapLimit(rows, 8, async function(row) {
        /*let data = {name: row.firstName,
          surname: row.lastName,
          telephone: row.phoneNumber,
          email: row.email }*/
          let response = {}
        if(typeof row.domainName !== 'undefined') {
          let data = {domain: row.domainName }

          let postdata =  JSON.stringify(data)
          response = await API.post('search', postdata)
        }
        let returnData = {}
        if(typeof response.data !== 'undefined') {
          returnData = { user: row, breach_info: response.data.data }
        } else {
          returnData = { user: row, breach_info: response }
        }
        return returnData
      }, (err, results) => {
        if (err) throw err
        // results is now an array of the response bodies
        console.log(results)

        console.log('------- creating workbook: ');

        fs.writeFile("./uploads/logfile.log", JSON.stringify(results), function(err) {
        if(err) {
          console.log(err)
        }
      })

      console.log("The file was saved!");

        // let ws_name = "4iQ_Results";
        // let ws = XLSX.utils.aoa_to_sheet(ws_data);

        // XLSX.utils.book_append_sheet(wb, ws, ws_name);

        //res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //res.setHeader('Content-Disposition', 'attachment; filename=out.xlsx');
        // let wbout = XLSX.writeFile(wb, 'out.xlsx');

        /* output format determined by filename */
        res.status(200).send(JSON.stringify(results));
      })

    })

    //res.status(200).json(JSON.stringify(req.file));

})


userRoutes.route('/bulkUserSearchCsv').post(upload.single('files'), asyncHandler(async (req, res, next) => {

  let fileName = "logfile" + new Date() + ".log"
  let errFileName = "errorFile" + new Date() + ".log"

  console.log('------- file json: ' + JSON.stringify(req.file))

  //csv().fromFile(req.file.path).subscribe((jsonObj)=>{

    //console.log(jsonObj);
    /*csv string
    person.comment,person.number
    hello,1234
    */
    //jsonObj: {person":{"comment":"hello", "number":1234}}
    const csvFilePath = req.file.path

    csv().fromFile(csvFilePath).then((json)=>{

      // we use .then instead of .subscribe as .then runs after the full file is read.
      // .subscribe runs line by line

    	//console.log(json)

    let len = Object.keys(json).length;
    console.log(len)

    async.mapLimit(json, 1, function(item, loopcallback) {
      console.log(JSON.stringify(item))
      if(typeof item.User.Email !== 'undefined') {
        console.log(item.User.Email)
        let data = { email: item.User.Email }

        let postdata =  JSON.stringify(data)

        console.log(postdata)
        var returnData

        API.post('search', postdata).then(function (resp) {
          // handle success
          //console.log(resp.data)
          returnData = { user: item.User, breach_info: resp.data.data }
          fs.writeFile("./uploads/" + fileName, JSON.stringify(returnData), { flag: "a" }, function(err) {
            if(err) {
              console.log(err)
            }
          })
          let total, count, page, numPages = 0
          let nextId = ""
          //total is all
          //count is how many in blocks of 10

          total = returnData.breach_info.query.pagination.total
          count = returnData.breach_info.query.pagination.count
          page = returnData.breach_info.query.pagination.page

          numPages = Math.ceil(total / 10)

          nextId = returnData.breach_info.next_id

          data = { email: item.User.Email, next_id: nextId }
          postdata = JSON.stringify(data)
          console.log(nextId)


          getNextResult(postdata, item, returnData, fileName).then(function (returnData) {

            console.log(nextId)
            page = returnData.breach_info.query.pagination.page
            nextId = returnData.breach_info.next_id

            data = { email: item.User.Email, next_id: nextId }
            postdata = JSON.stringify(data)

            API.post('search', postdata).then(function (resp) {

              returnData = { user: item.User, breach_info: resp.data.data }

              fs.writeFile("./uploads/" + fileName, JSON.stringify(returnData), { flag: "a" }, function(err) {
                if(err) {
                  console.log(err)
                }
              })
              nextId = returnData.breach_info.next_id
              console.log(nextId)
            })
          })

          console.log(getPercent(item.User.UniqueID+1, len) + '% - success')
          loopcallback()
        })
        .catch(function (error) {
          // handle error
          //console.log(error)
          returnData = { user: item.User, error: error.response }
          fs.writeFile("./uploads/" + errFileName, JSON.stringify(returnData), { flag: "a" }, function(err) {
            if(err) {
              console.log(err)
            }
          })
          console.log(getPercent(item.User.UniqueID+1, len) + '% - error')
          loopcallback()
        })
      }
      else loopcallback()
    }, (err /*, results*/) => {

        console.log(err)

        //if (err) throw err
        // results is now an array of the response bodies
        //console.log(results)

      })

    //})

    })

    /* output format determined by filename */
    res.status(200).send(JSON.stringify('ok'));
}))


userRoutes.route('/bulkUserSearch').post(upload.single('files'), function(req, res, next) {

  const schema = {
    'Sequence #': {
      prop: 'sequenceNumber',
      type: String
    },
    'First Name': {
      prop: 'firstName',
      type: String
    },
    'Last Name': {
      prop: 'lastName',
      type: String
    },
    'Phone': {
      prop: 'phoneNumber',
      type: String
    },
    'Email': {
      prop: 'email',
      type: String
    }
  }

  console.log('------- file json: ' + JSON.stringify(req.file));

  console.log('environment username: ' + env.FourIQ_USERNAME);

  console.log('about to read...')
  readXlsxFile(req.file.path, { schema }).then(({ rows, errors }) => {
    // `errors` have shape `{ row, column, error, value }`.
    // errors.length === 0

    //console.log(rows)

      async.mapLimit(rows, 6, async function(row) {
        console.log(row.email)
        if(typeof row.email !== 'undefined') {
        /*let data = {name: row.firstName,
          surname: row.lastName,
          telephone: JSON.stringify(row.phoneNumber),
          email: row.email } */
          let data = { email: row.email }

          let postdata =  JSON.stringify(data)

          //console.log(postdata)
          var response;
          var returnData;

          try {
            response = await API.post('search', postdata)
          }catch(error) { returnData = { user: row, error: error } }

          if(response.data !== 'undefined') {
            returnData = { user: row, breach_info: response.data.data }
          }
        //console.log('--- adding json to sheet')
        //try {
          //var ws = XLSX.utils.json_to_sheet(rows)
          //XLSX.utils.sheet_add_json(ws, row)
          //console.log('--- adding sheet to book')
          //XLSX.utils.book_append_sheet(wb, ws, ws_name)
        //}catch(err) { console.log(err) }
        //try {
          //var ws = XLSX.utils.json_to_sheet(response.data.data.results);
          //var ws_name = "DataSheet 2";
          //XLSX.utils.book_append_sheet(wb, ws, ws_name);
        //}catch(err) { console.log(err) }
          return returnData
        }
        else return row
      }, (err, results) => {
        console.log(err)
        //if (err) throw err
        // results is now an array of the response bodies
        console.log(results)

        let fileName = "logfile" + new Date() + ".log"
        let errFileName = "errorFile" + new Date() + ".log"

        fs.writeFile("./uploads/" + errFileName, err, function(err) {
          if(err) {
            console.log(err)
          }
        })

        fs.writeFile("./uploads/" + fileName, JSON.stringify(results), function(err) {
          if(err) {
            console.log(err)
          }
        })

      console.log('The file was saved!');



        //res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //res.setHeader('Content-Disposition', 'attachment; filename=out.xlsx');
      //let wbout = XLSX.write(wb, {bookType:'xlsx', type:'buffer'})

      //fs.writeFile('./uploads/out.xlsx', XLSX.write(wb, {bookType:'xlsx', type:'buffer'}), 'binary', function(err) {
      //  if(err) {
      //    console.log(err)
      //  }
      //})

        /* output format determined by filename */
        res.status(200).send(JSON.stringify(results));
      })

    })

    //res.status(200).json(JSON.stringify(req.file));

})

userRoutes.route('/monitorUser').post(function(req, res, next) {
  let postdata = JSON.stringify({
      email: req.body.userName
  })
  API.post('search', postdata).then(function(response) {
    // JSON responses are automatically parsed.
      // console.log(response)
      console.log(response.data.data)
      var apiinfo = { request: postdata, method: 'POST', url: response.config.url, status: response.status, response: response.data.data };
      console.log(JSON.stringify(apiinfo));

      TestUsers.findOne({ 'account.name' : req.body.userName }, function(err, user) {
        if (err) {
          res.status(200).json(err);
        }
        if (user) {
          user.cyberData.results = response.data.data;
          user.save(function(error, result) {
            if (error) {
              res.status(200).json('status: Unable to update user.');
            }
            res.status(200).json(apiinfo);
          });
        }
      });
  });
})



userRoutes.route('/registerUser').post(function(req, res, next) {
  console.log(req.body);

  TestUsers.hashPassword(req.body.userPassword, function(err, pass) {
    if (err) {
      res.status(200).json(err);
    }

    if (pass) {

      var newUser = new TestUsers ({
        name: { first: req.body.firstName, last: req.body.lastName },
        account: { name: req.body.userName, password: pass }
      });

      let postdata = JSON.stringify({
          email: req.body.userName
      })

      API.post('search', postdata).then(function(response) {
        // JSON responses are automatically parsed.
          // console.log(response)
          console.log(response.data.data)

          var apiinfo = { request: postdata, method: 'POST', url: response.config.url, status: response.status, response: response.data.data };
          console.log(JSON.stringify(apiinfo));

          TestUsers.findOne({ 'account.name' : req.body.userName }, function (err, docs) {
            if (docs) {
              res.status(200).send('Unable to register user, user already exists.');
            } else {
              newUser.save(function(error, result) {
                if (error) {
                  res.status(200).send('Unable to register user.');
                }

                var jResp = { response: result, api: apiinfo }
                console.log(JSON.stringify(jResp));
                res.status(200).json(jResp);
            });
          }
        });
      });
    }
  });
});

userRoutes.route('/login').post(function(req, res, next) {
  console.log(req.body);

  TestUsers.getAuthenticated(req.body.userName, req.body.userPassword, function(err, user, reason) {
    if (err) {
      res.status(200).json(err);
    }

    if(user) {
      // creating the data to post
      let postdata = JSON.stringify({
          hash: crypto.createHash('sha256').update(req.body.userPassword).digest('hex')
      })
      // posting
      API.post('stolenid/password/recovery/check', postdata).then(function(response) {
        var apiinfo = { method: 'post', url: response.config.url, status: response.status, response: response.data };
        console.log(JSON.stringify(response.data));
        console.log('login success');
        var jResp = { response: 'status: success', api: apiinfo }
        res.status(200).json(jResp)
      }).catch(function (error) {
        var apiinfo = { request: postdata, method: 'POST', url: error.response.config.url, status: error.response.status, response: error.response.data };
        var jResp = { response: 'status: success', api: apiinfo }
        console.log(JSON.stringify(error.data));
        res.status(200).json(jResp);
      });
    }

    var reasons = TestUsers.failedLogin;
    switch (reason) {
      case reasons.NOT_FOUND:
        res.status(200).json('status: account not found.')
        break;
      case reasons.PASSWORD_INCORRECT:
        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        res.status(200).json('status: information incorrect.')
        break;
      case reasons.MAX_ATTEMPTS:
        // send email or otherwise notify user that account is
        // temporarily locked
        res.status(200).json('status: account locked.')
        break;
    }
  })
})

userRoutes.route('/forgotpass').post(function(req, res, next) {
  console.log(req.body);

  TestUsers.findOne({ 'account.name' : req.body.userName }, function(err, user) {
    if (err) {
      res.status(200).json(err);
    }

    TestUsers.hashPassword(req.body.userPassword, function(err, pass) {
      if (err) {
        res.status(200).json(err);
      }

      if (pass) {
        user.account.password = pass;
        user.save(function(error, result) {
          if (error) {
            res.status(200).json('status: Unable to update user.');
          }
          res.status(200).json(result);
        });
      }
    })
  })
})


module.exports = userRoutes
