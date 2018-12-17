function sum(a) {
   const argc = arguments.callee
   if (argc.store == undefined) {
       argc.store = a;
   }
   else argc.store += a;
   return argc
}
sum.toString = () => sum.store