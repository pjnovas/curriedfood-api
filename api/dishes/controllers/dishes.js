'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

 // TODO: REFACTOR AND DRY THIS THING

module.exports = {

  async create(ctx) {
    let entity;

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services.dishes.create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services.dishes.create(ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.dishes });
  },

  async update(ctx) {
    let entity;

    const [dishes] = await strapi.services.dishes.find({
      id: ctx.params.id,
      'author.id': ctx.state.user.id,
    });

    if (!dishes) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.dishes.update(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.dishes.update(
        ctx.params,
        ctx.request.body
      );
    }

    return sanitizeEntity(entity, { model: strapi.models.dishes });
  },

  async delete(ctx) {
    let entity;

    const [dishes] = await strapi.services.dishes.find({
      id: ctx.params.id,
      'author.id': ctx.state.user.id,
    });

    if (!dishes) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.dishes.delete(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.dishes.delete(
        ctx.params,
        ctx.request.body
      );
    }

    return sanitizeEntity(entity, { model: strapi.models.dishes });
  },
};
