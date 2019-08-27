import dialogflow_v2 as dialogflow


def list_entity_types(project_id):
    entity_types_client = dialogflow.EntityTypesClient()

    parent = entity_types_client.project_agent_path(project_id)

    entity_types = entity_types_client.list_entity_types(parent)

    entity_types_array = [('', '')]
    for entity_type in entity_types:
        name_split = entity_type.name.split('/')
        entity_types_array.append((name_split[-1], entity_type.display_name))

    return entity_types_array
