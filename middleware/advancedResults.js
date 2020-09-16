const advancedResults = (model, populate) => async(request, response, next) => {
    const requestQuery = { ...request.query };

    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(field => delete requestQuery[field]);

    let queryStr = JSON.stringify(requestQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let dbQuery = model.find(JSON.parse(queryStr));

    if(request.query.select) {
        const fields = request.query.select.split(',');
        dbQuery.select(fields.join(' '));
    }

    var sortBy = ['createdAt'];
    if(request.query.sort) {
        sortBy = request.query.sort.split(',');
    }
    dbQuery.sort(sortBy.join(' '));

    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    
    dbQuery.skip(startIndex).limit(limit);

    if(populate) {
        dbQuery = dbQuery.populate(populate);
    }

    const results = await dbQuery;

    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if(startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit
        }
    }

    response.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = advancedResults;