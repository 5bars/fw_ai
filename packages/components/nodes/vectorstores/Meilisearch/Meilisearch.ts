import { getCredentialData, getCredentialParam } from '../../../src'
import { ICommonObject, INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Meilisearch } from 'meilisearch'
import { MeilisearchRetriever } from './core'
import { flatten } from 'lodash'
import { Document } from '@langchain/core/documents'
import { v4 as uuidv4 } from 'uuid'
import { Embeddings } from '@langchain/core/embeddings'

class MeilisearchRetriever_node implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    credential: INodeParams
    badge: string
    outputs: INodeOutputsValue[]
    author?: string

    constructor() {
        this.label = 'Meilisearch'
        this.name = 'meilisearch'
        this.version = 1.0
        this.type = 'Meilisearch'
        this.icon = 'Meilisearch.png'
        this.category = 'Vector Stores'
        this.badge = 'NEW'
        this.description = `Upsert embedded data and perform similarity search upon query using Meilisearch hybrid search functionality`
        this.baseClasses = ['BaseRetriever']
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['meilisearchApi']
        }
        this.inputs = [
            {
                label: 'Document',
                name: 'document',
                type: 'Document',
                list: true,
                optional: true
            },
            {
                label: 'Embeddings',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Host',
                name: 'host',
                type: 'string',
                description: "This is the URL for the desired Meilisearch instance, the URL must not end with a '/'"
            },
            {
                label: 'Index Uid',
                name: 'indexUid',
                type: 'string',
                description: 'UID for the index to answer from'
            },
            {
                label: 'Top K',
                name: 'K',
                type: 'number',
                description: 'number of top searches to return as context, default is 4',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Semantic Ratio',
                name: 'semanticRatio',
                type: 'number',
                description: 'percentage of sematic reasoning in meilisearch hybrid search, default is 0.75',
                additionalParams: true,
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Meilisearch Retriever',
                name: 'MeilisearchRetriever',
                description: 'retrieve answers',
                baseClasses: this.baseClasses
            }
        ]
        this.outputs = [
            {
                label: 'Meilisearch Retriever',
                name: 'retriever',
                baseClasses: this.baseClasses
            }
        ]
    }
    //@ts-ignore
    vectorStoreMethods = {
        async upsert(nodeData: INodeData, options: ICommonObject): Promise<any> {
            const credentialData = await getCredentialData(nodeData.credential ?? '', options)
            const meilisearchAdminApiKey = getCredentialParam('meilisearchAdminApiKey', credentialData, nodeData)
            const docs = nodeData.inputs?.document as Document[]
            const host = nodeData.inputs?.host as string
            const indexUid = nodeData.inputs?.indexUid as string
            const embeddings = nodeData.inputs?.embeddings as Embeddings
            let embeddingDimension: number = 384
            const client = new Meilisearch({
                host: host,
                apiKey: meilisearchAdminApiKey
            })
            const flattenDocs = docs && docs.length ? flatten(docs) : []
            const finalDocs = []
            for (let i = 0; i < flattenDocs.length; i += 1) {
                if (flattenDocs[i] && flattenDocs[i].pageContent) {
                    const uniqueId = uuidv4()
                    const { pageContent, metadata } = flattenDocs[i]
                    const docEmbedding = await embeddings.embedQuery(pageContent)
                    embeddingDimension = docEmbedding.length
                    const documentForIndexing = {
                        pageContent,
                        metadata,
                        objectID: uniqueId,
                        _vectors: {
                            ollama: {
                                embeddings: docEmbedding,
                                regenerate: false
                            }
                        }
                    }
                    finalDocs.push(documentForIndexing)
                }
            }
            let index: any
            let taskUid_created: number = 0

            try {
                index = await client.getIndex(indexUid)
            } catch (error) {
                console.warn('Index not found, creating a new index...')

                try {
                    const createResponse = await client.createIndex(indexUid, { primaryKey: 'objectID' })
                    taskUid_created = createResponse.taskUid
                    let createTaskStatus = await client.getTask(taskUid_created)

                    while (createTaskStatus.status !== 'succeeded') {
                        createTaskStatus = await client.getTask(taskUid_created)
                        console.log('create index status ', createTaskStatus)
                        if (createTaskStatus.error !== null || createTaskStatus.status === 'failed') {
                            throw new Error('Error during index creation task: ' + createTaskStatus.error)
                        }
                    }
                    index = await client.getIndex(indexUid)
                } catch (taskError) {
                    console.error('Error during index creation process:', taskError)
                }
            }

            try {
                await index.updateFilterableAttributes(['metadata'])
                await index.updateSettings({
                    embedders: {
                        ollama: {
                            source: 'userProvided',
                            dimensions: embeddingDimension
                        }
                    }
                })
                const addResponse = await index.addDocuments(finalDocs)
                taskUid_created = addResponse.taskUid
                let AddTaskStatus = await client.getTask(taskUid_created)
                while (AddTaskStatus.status !== 'succeeded') {
                    AddTaskStatus = await client.getTask(taskUid_created)
                    console.log('add documents status ', AddTaskStatus)
                    if (AddTaskStatus.error !== null || AddTaskStatus.status === 'failed') {
                        throw new Error('Error during index creation task: ' + AddTaskStatus.error)
                    }
                }
                index = await client.getIndex(indexUid)
            } catch (error) {
                console.error('Error occurred while adding documents:', error)
            }
            return { numAdded: finalDocs.length, addedDocs: finalDocs }
        }
    }
    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const meilisearchSearchApiKey = getCredentialParam('meilisearchSearchApiKey', credentialData, nodeData)
        const meilisearchAdminApiKey = getCredentialParam('meilisearchAdminApiKey', credentialData, nodeData)
        const host = nodeData.inputs?.host as string
        const indexUid = nodeData.inputs?.indexUid as string
        const K = nodeData.inputs?.K as string
        const semanticRatio = nodeData.inputs?.semanticRatio as string
        const embeddings = nodeData.inputs?.embeddings as Embeddings

        const experimentalEndpoint = host + '/experimental-features/'
        const token = meilisearchAdminApiKey

        const experimentalOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                vectorStore: true
            })
        }

        try {
            const response = await fetch(experimentalEndpoint, experimentalOptions)
            if (!response.ok) {
                throw new Error(`Failed to enable vectorStore: ${response.statusText}`)
            }

            const data = await response.json()

            const vectorStoreEnabled = data.vectorStore
            if (vectorStoreEnabled !== true) {
                throw new Error('Failed to enable vectorStore, vectorStrore property returned is not true')
            }
        } catch (error) {
            console.error('Error enabling vectorStore feature:', error)
        }

        const hybridsearchretriever = new MeilisearchRetriever(
            host,
            meilisearchSearchApiKey,
            meilisearchAdminApiKey,
            indexUid,
            K,
            semanticRatio,
            embeddings
        )
        return hybridsearchretriever
    }
}
module.exports = { nodeClass: MeilisearchRetriever_node }
