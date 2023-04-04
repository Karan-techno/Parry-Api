const db = require("../models");
const md5 = require("md5");
const _ = require("lodash");
const path = require("path");
const User = db.user;
const Flow = db.flow;
const Comment = db.comment;
const SubComment = db.subcomment;
const Profile = db.profile;
const multer = require('multer');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const { Otp } = require("../models/otp.models");
const { Usermodel } = require("../models/user.models");
const { flow } = require("lodash");
const jwt = require('jsonwebtoken');




exports.register = async (req, res) => {
  const register = new User({
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
    phoneNumber: req.body.phoneNumber,
  });

  try {
    const savedUser = await register.save();
    const token = jwt.sign({ _id: savedUser._id }, 'Parry');
    res.header('auth-token', token).send({
      success: true,
      message: 'User registered successfully!',
      token: token,
      data: savedUser
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'User registration failed!',
      error: error.message
    });
  }
}

// exports.register = async (req, res) => {
//     const register = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: md5(req.body.password),
//       phoneNumber: req.body.phoneNumber,
//     });
  
//     register.save().then((data) => {
//       res.send({
//         success: "true",
//         message: "user registered successfully!!",
//         data: data
//       })
//     }).catch((error) => {
//       res.send({
//         success: "false",
//         message: "user not registered ",
//         data: error
//       })
//     })
//   }

exports.login = async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email, password: md5(req.body.password) });
    // console.log(user);
    if (!user) {
      return res.status(401).send({
        success: false,
        data: null,
        message: 'Invalid login details'
      });
    }
    // console.log(process.env.SECRET_KEY);
    const token = jwt.sign({ _id: user._id }, 'Parry');
    
    res.send({
      success: true,
      message: 'Login successful',
      token: token
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      data: null,
      message: error.message
    });
  }
}

//   exports.login = async (req, res) => {
//     let user = await User.findOne({email:req.body.email, password:req.body.password})
//     if(user){
//         user.save(user).then(() => {
//             res.status(200).send({
//                 success:true,
//                 message:"Login successfully"
//             })
//         })
//     }else{
//         return res.status(200).send({
//             success:false,
//             data:null,
//             message:'Invalid login details'
//         })
//     }
// }     

exports.signUp = async (req, res) => {
    const user = await User.findOne({

        number: req.body.number,

    });

    if(user) return res.send("User already registered");
    const OTP = otpGenerator.generate(6, {
        digits: true, lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false
    });


    const number = req.body.number;
    console.log(OTP);
    
    
    const otp = new Otp({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.send("Otp send successfully")

}
  
  
  
 module.exports.verifyOtp = async (req, res) => {
        try {
          const otpHolder = await Otp.find({ number: req.body.number });
          if (otpHolder.length === 0) {
            return res.status(400).send("You used an expired OTP!");
          }
          const rightOtpFind = otpHolder[otpHolder.length - 1];
          const validOtp = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
          console.log(validOtp);
          if (validOtp) {
            const user = new Usermodel({ number: req.body.number });
            const result = await user.save();
            const token = jwt.sign({ _id: result._id }, 'Parry');
            const OTPDelete = await Otp.deleteMany({ number: rightOtpFind.number });
            return res.status(200).send({
              message: "OTP Verified!",
              token: token,
              data: result,
            });
          } else {
            return res.status(400).send("Your OTP was wrong!");
          }
        } catch (err) {
          console.log(err);
          return res.status(500).send("Something went wrong!");
        }
      };

   exports.forgotPassword = async (req, res) => {
 
        const email = req.body.email;
        // const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(404).send("User not found");
        }
      
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();
      
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'namanshah2104@gmail.com',
            pass: 'ikauaajyuqnzwkqk'
          }
        });
        const mailOptions = {
          from: 'Karan',
          to: "mrthakor2804@gmail.com",
          subject: 'Password reset',
          text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
                 Please click on the following link to reset your password:\n\n
                 http://${req.headers.host}/reset-password/${token}\n\n
                 If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Failed to send email");
          }
          
          res.send("Email sent");
        });
      }

      
      
    exports.resetPassword = async (req, res) => {
      const condition = {
        id : req.body.id,
        password : md5(req.body.password)
      }
      User.findByIdAndUpdate(req.body.id, condition, {useFindAndModify:false}).then((data) => {
        res.send({
            success:'true',
            message:"Reset Password successfully !!",
             data:data
        })
    }).catch((error) => {
        res.send({
            success:'false',
            message:"Reset Password not successfully !!",
            data:error
        })
    })
  }

// Spots section --

  exports.createSpotFlows = (req, res) => {
    const userId = req.user._id;
    // console.log(userId);
    const flow = new Flow ({
        type: req.body.type,
        tag : req.body.tag,
        image:req.body.image,
        description:req.body.description,
        upvote:req.body.upvote,
        user:userId
    });
    flow.save().then((data) => {
      res.send({
          success:'true',
          message:"Spot created !!",
          data:data
      })
  }).catch((error) => {
      res.send({
          success:'false',
          message:"Spot not created !!",
          data:error
      })
  })
  }

  exports.uploadImage = async (req, res) => {

    const storage = multer.diskStorage({
  
        destination: function(req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function(req, file, callback) {
            callback(null, md5(Date.now()) + path.extname(file.originalname));
        }
    });
  
    const uploadFile = multer({
        storage: storage,
    }).single('image');
  
    uploadFile(req, res, async(err) => {
  
        if (!req.file) {
            res.status(500).send({
                success: false,
                data: [],
                message: "Select Image"
            });
  
        } else if (err) {
            res.status(500).send({
                success: false,
                data: [],
                message: "not upload"
            });
  
        } else {
            Flow.create({pic:process.env.MAIN_URL + req.file.filename}).then((data) => {
                                     
            res.status(200).send({
                success: true,
                data: { filepath_url: req.file.filename, url: process.env.MAIN_URL +"/uploads/" + req.file.filename },
                message: "File uploaded",
            });
        }).catch((err) => {
            res.send(err);
        })
        }
    });
  }

  exports.updateSpotFlow = async (req, res) => {
    const userId = req.user._id;
    const condition = {
      type: req.body.type,
        tag : req.body.tag,
        image:req.body.image,
        description:req.body.description,
        upvote:req.body.upvote,
        user:userId
    }
    Flow.findByIdAndUpdate(req.body.id, condition, {useFindAndModify:false}).then((data) => {
      res.send({
          success:'true',
          message:"Spot updated successfully !!",
           data:data
      })
  }).catch((error) => {
      res.send({
          success:'false',
          message:"Spot updated not successfully !!",
          data:error
      })
  })
}
    //   const securePassword = async(password)=>{
    //     try {
    //       const passwordHash = await bcrypt.hash(password, 10);
    //       return passwordHash
    //     } catch (error) {
    //       res.status(400).send(error.message)
    //     }
    //   }
    //   try {
        
    //     const token = req.params.token
    //     const tokenData = await User.findOne({token:token});
    //     if(tokenData){
    //       const password = req.body.password;
    //       const userId = req.body.userId
    //       const newPassword = await securePassword(password);
    //       const userData = await User.findByIdAndUpdate({_id:tokenData._id},{userId},{$set:{password:newPassword,token:''}},{new:true});
    //       res.status(200).send({success:true, msg:"password has been reset", data:userData});
    //     }
    //     else{
    //       res.status(200).send({success:false,msg:"not updated"})
    //     }
    //   } catch (error) {
    //     res.status(400).send({success:false,msg:error.message});
        
    //   }
    // }
      //   const token = req.params.token;
      //   const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      //   if (!user) {
      //     return res.status(400).send("Invalid or expired token");
      //   }
      
      //   user.password = req.body.password;
      //   user.resetPasswordToken = undefined;
      //   user.resetPasswordExpires = undefined;
      //   await user.save();
      //   res.send("Reset password successfully!!");
        
       

//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   });
//   const upload = multer({ storage: storage });



  exports.allSpotFlows = (req,res) => {
    Flow.find({}).then((data) => {
        res.send({
            success:'true',
            message:"All Spots !!",
            data:data
        })
    })
}



exports.deleteSpotFlow = (req,res) => {
  const userId = req.user._id;
  const condition = {
    type: req.body.type,
      tag : req.body.tag,
      image:req.body.image,
      description:req.body.description,
      upvote:req.body.upvote,
      user:userId
  }
  Flow.findByIdAndDelete(req.body.id, condition, {useFindAndModify:false}).then((data) => {
    res.send({
        success:'true',
        message:"Spot deleted successfully !!",
         data:data
    })
}).catch((error) => {
    res.send({
        success:'false',
        message:"Spot not deleted successfully !!",
        data:error
    })
})
}

//Comment section --

exports.commentFlow = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const comment = new Comment({
    text: req.body.text,
    user: userId,
    spotFlow: req.body.spotFlowId,
  });

  comment.save().then((data) => {
    res.send({
      success: 'True',
      message: 'Comment added!',
      data: data,
    });
  }).catch((error) => {
    res.send({
      success: 'False',
      message: 'Comment not added',
      data: error,
    });
  });
};


exports.subComment = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

const subComment = new SubComment({
  text: req.body.text,
  user: userId,
  comment: req.body.commentId,
});

subComment.save().then((subComment) => {
  res.send({
    success: true,
    message: 'Sub-comment added successfully',
    data: subComment,
  });
}).catch((error) => {
  res.send({
    success: false,
    message: 'Sub-comment not added',
    data: error,
  });
});
}

exports.mySpots = async (req, res) => {
  // if (!req.body.user || !req.body.user._id) {
  //    res.status(400).send({
  //       success: false,
  //       message: "User ID not provided in request body",
  //       data: null
  //    });
  //    return;
  // }

  const userId = req.user._id
  Flow.find({user:userId}).then((data) => {
   res.send({
       success:'true',
       message:"All Spots !!",
       data:data
   })
  })
}


// exports.mySpots = async (req, res) => {
//    const userId = req.body.user._id
//    Flow.find({user:userId}).then((data) => {
//     res.send({
//         success:'true',
//         message:"All Spots !!",
//         data:data
//     })
// })
// }

exports.myProfile = async (req, res) => {
  const profile = new Profile ({
    name:req.body.name,
    profilepic:req.body.profilepic,
    ridingstyle:req.body.ridingstyle,
    about:req.body.about,
  })
  profile.save().then((data) => {
    res.send({
        success:'true',
        message:"Profile created !!",
        data:data
    })
}).catch((error) => {
    res.send({
        success:'false',
        message:"Profile not created !!",
        data:error
    })
})
}

exports.updateProfile = async (req, res) => {
  const condition = {
    name:req.body.name,
    profilepic:req.body.profilepic,
    ridingstyle:req.body.ridingstyle,
    about:req.body.about,
      
  }
  Profile.findByIdAndUpdate(req.body.id, condition, {useFindAndModify:false}).then((data) => {
    res.send({
        success:'true',
        message:"Profile updated successfully !!",
         data:data
    })
}).catch((error) => {
    res.send({
        success:'false',
        message:"Profile not updated successfully !!",
        data:error
    })
})

}

exports.allProfiles = (req,res) => {
  Profile.find({}).then((data) => {
      res.send({
          success:'true',
          message:"All Profiles !!",
          data:data
      })
  })
}

exports.deleteProfile = (req,res) => {
  const condition = {
    name:req.body.name,
    profilepic:req.body.profilepic,
    ridingstyle:req.body.ridingstyle,
    about:req.body.about,
  }
  Profile.findByIdAndDelete(req.body.id, condition, {useFindAndModify:false}).then((data) => {
    res.send({
        success:'true',
        message:"Profile deleted successfully !!",
         data:data
    })
}).catch((error) => {
    res.send({
        success:'false',
        message:"Profile not deleted successfully !!",
        data:error
    })
})
}

exports.accountSettings = async (req, res) => {
  const userId = req.user._id;
  const { email, password } = req.body;
  try {
    const user = await User.findById(userId);
    // if (user.otpCode !== otp) {
    //   res.status(401).json({ message: 'Invalid OTP code' });
    //   return;
    // }
    user.email = email;
    user.password = password;
    // user.phoneNumber = phoneNumber;

    // user.otpCode = null;

    await user.save();

    res.status(200).json({ message: 'Email and Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update ' });
  }
}

exports.sendOtpCode = async (req, res) => {
  const userId = req.user._id;
  const { phoneNumber } = req.body;

  try{
    const otpCode = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false});

    await User.findByIdAndUpdate(userId, { otpCode, phoneNumber });

    res.status(200).json({ message: 'OTP code sent successfully' });
    console.log(otpCode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP code' });
  }
}
  
exports.verifyOtpCode = async (req, res) => {
  const userId = req.user._id;
  const { otp } = req.body;

  try {
    const user = await User.findById(userId);

    if (user.otpCode !== otp) {
      res.status(401).json({ message: 'Invalid OTP code' });
      return;
    }

    user.otpCode = null;
    await user.save();

    res.status(200).json({ message: 'OTP code verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify OTP code' });
  }
};

