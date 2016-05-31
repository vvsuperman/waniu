/**
 * @author: Jason.友伟 zhanyouwei@meitunmama.com
 * Created on 16/5/31.
 */

exports.authorize = function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/admin/login');
  } else {
    next();
  }
};
