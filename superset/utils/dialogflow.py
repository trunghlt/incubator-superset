import dialogflow_v2 as dialogflow


def list_entity_types(project_id):
    entity_types_client = dialogflow.EntityTypesClient()

    parent = entity_types_client.project_agent_path(project_id)

    entity_types = entity_types_client.list_entity_types(parent)

    entity_types_array = [('', '')]
    for entity_type in entity_types:
        entity_types_array.append((entity_type.display_name, entity_type.display_name))

    return entity_types_array
