FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV BCA_CLONE_HOST=0.0.0.0

COPY --chown=node:node mirror ./mirror
COPY --chown=node:node public ./public
COPY --chown=node:node docs/research/bca-homepage/source.html ./docs/research/bca-homepage/source.html

USER node
EXPOSE 3000
CMD ["node", "mirror/server.mjs"]
