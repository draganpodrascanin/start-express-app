class APIFeatures {
  constructor(query, queryString) {
    this.query = query;

    //queryString represented as object
    //passed as req.query from controler
    this.queryString = queryString;

  }

  filter() {
    /*
      Find model that match the request of query string
      excluding page, sort, limit, fields
      we have other logic for those parameters
    */
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    /*
      if specified sort by parameter in queryString,
      if not default to createdAt descending (new first)
    */
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    /*
      if specified select only certain fields of Model,
      if not, just unselect '-__v'
    */

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    /*
      if specified page, add skip and limit to query
      page 1 = skip 0, limit 10, page 2, skip 10, limit 10
    */
    if(this.queryString.page){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
module.exports = APIFeatures;
