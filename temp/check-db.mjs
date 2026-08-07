import { PrismaClient } from '/home/ubuntu/clinica/node_modules/.prisma/client/index.js';
const p = new PrismaClient();
const u = await p.usuarios.findUnique({where:{email:'admin@clinica.com'}, select:{id:true,nome:true,email:true,role:true,ativo:true,senha:true}});
if(u){console.log('found:', JSON.stringify({id:u.id,nome:u.nome,email:u.email,role:u.role,ativo:u.ativo,senhaLen:u.senha?u.senha.length:null,senhaStart:u.senha?u.senha.substring(0,10):null}))}
else{console.log('NOT FOUND')}
await p.$disconnect();
