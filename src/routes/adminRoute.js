/** @param { import('express').Express} app */
module.exports = (app) => {
  const admin = app.controllers.adminController

  app.post('/admin/insert', admin.insert)
  app.post('/admin/update', admin.update)
  app.post('/admin/delete', admin.delete)
  app.post('/admin/find', admin.find)
}
