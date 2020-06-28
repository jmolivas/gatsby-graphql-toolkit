import { ISourcingConfig, ISourcingContext } from "../../types"
import { defaultGatsbyFieldAliases } from "../../config/default-gatsby-field-aliases"
import { createNodeIdTransform } from "../../config/node-id-transform"
import { createTypeNameTransform } from "../../config/type-name-transform"
import { formatLogMessage } from "../../utils/format-log-message"

export function createSourcingContext(
  config: ISourcingConfig
): ISourcingContext {
  const gatsbyFieldAliases =
    config.gatsbyFieldAliases ?? defaultGatsbyFieldAliases

  const {
    gatsbyApi,
    verbose,
    idTransform = createNodeIdTransform(gatsbyFieldAliases),
    typeNameTransform = createTypeNameTransform(config.gatsbyTypePrefix),
    queryConcurrency = Number(process.env.GATSBY_CONCURRENT_DOWNLOAD) || 50,
  } = config
  const { reporter } = gatsbyApi
  const format = string => formatLogMessage(string, { verbose })

  return {
    ...config,
    queryConcurrency,
    gatsbyFieldAliases,
    idTransform,
    typeNameTransform,
    formatLogMessage: format,
    fetchingActivity: reporter.activityTimer(format(`fetching nodes`)),
    creatingActivity: reporter.activityTimer(format(`creating nodes`)),
  }
}