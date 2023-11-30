const verifyRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401);
        const rolesArray = allowedRoles;
        roll=req.role;
        var result=false;
        for(let i=0;i<rolesArray.length;i++){
            if(rolesArray[i]==roll)
                result=true;
        }
        if (!result) return res.sendStatus(401);
        next();
    }
}
module.exports = verifyRoles