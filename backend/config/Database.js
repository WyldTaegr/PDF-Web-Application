import { Sequelize } from "sequelize";
 
const db = new Sequelize('csds393_project', 'remote_admin', '1234', {
    host: "ec2-52-7-212-92.compute-1.amazonaws.com",
    dialect: "mysql"
});
 
export default db;