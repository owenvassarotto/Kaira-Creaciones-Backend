// Middleware para verificar si el usuario es administrador
function isAdmin(req, res, next) {
    // Verificar si el usuario es un administrador
    if (req.user && req.user.is_admin) {
        // El usuario es un administrador, continuar con la siguiente función en la cadena de middleware
        next();
    } else {
        // El usuario no es un administrador, devolver un error de acceso prohibido
        return res.status(403).json({ message: 'Acceso denegado. Solo los administradores tienen acceso a esta función.' });
    }
}

export default isAdmin;