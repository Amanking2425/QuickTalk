import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    bio:{
        type: String,
        default: ""
    },
    profilePic:{
        // type: String,
        // default: "",
        type: String,
      default: function () {
        // Use a random number (or timestamp) as idx
        const idx = Math.floor(Math.random() * 1000); 
        return `https://api.samplefaces.com/face?width=200&${idx}`;
      }
    },
    nativeLanguage:{
        type: String,
        default: ""
    },
    learningLanguage:{
        type: String,
        default: ""
    },
    location:{
        type: String,
        default: ""
    },
    isOnboarded:{
        type: Boolean,
        default: false
    },
    friends: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
   ],
},{timestamps: true});



// Pre hook to hash password before saving

userSchema.pre("save", async function(next){

    // Check if password is modified or new
    if (!this.isModified("password")) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);

        next();
    }catch(error){
        next(error);
    }
})

 userSchema.methods.matchPassword = async function(enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
