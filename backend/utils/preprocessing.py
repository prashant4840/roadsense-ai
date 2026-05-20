import pandas as pd
from typing import Dict, List, Any


class PreprocessingError(ValueError):
    """Raised when preprocessing encounters invalid input."""
    pass


def validate_input(raw_input: Dict[str, Any], categorical_mappings: Dict[str, List[str]], numerical_features: List[str]) -> None:
    """
    Validate input data for required features and value ranges.

    Raises PreprocessingError if validation fails.
    """
    # Check all numerical features are present
    missing_numerical = [f for f in numerical_features if f not in raw_input or raw_input[f] is None]
    if missing_numerical:
        raise PreprocessingError(f"Missing required numerical features: {missing_numerical}")

    # Check all categorical features are present
    missing_categorical = [f for f in categorical_mappings.keys() if f not in raw_input or raw_input[f] is None]
    if missing_categorical:
        raise PreprocessingError(f"Missing required categorical features: {missing_categorical}")

    # Validate categorical values are in allowed set
    for feature_name, possible_values in categorical_mappings.items():
        actual_value = raw_input.get(feature_name)
        if actual_value not in possible_values:
            raise PreprocessingError(
                f"Invalid value '{actual_value}' for feature '{feature_name}'. "
                f"Allowed values: {possible_values}"
            )

    # Validate numerical types and reasonable ranges
    for feature in numerical_features:
        value = raw_input.get(feature)
        try:
            float(value)
        except (TypeError, ValueError):
            raise PreprocessingError(f"Feature '{feature}' must be numeric, got {type(value).__name__}")

        # Reasonable bounds checks
        if feature == 'hour' and not (0 <= value <= 23):
            raise PreprocessingError(f"Hour must be 0-23, got {value}")
        if feature == 'temperature' and not (-50 <= value <= 60):
            raise PreprocessingError(f"Temperature must be -50 to 60°C, got {value}")
        if feature in ['is_weekend', 'is_peak_hour', 'is_night'] and value not in [0, 1]:
            raise PreprocessingError(f"Binary feature '{feature}' must be 0 or 1, got {value}")
        if feature in ['vehicles_involved', 'casualties'] and value < 0:
            raise PreprocessingError(f"Feature '{feature}' cannot be negative, got {value}")


def encode_categorical_features(data_dict: Dict[str, Any], categorical_mappings: Dict[str, List[str]]) -> Dict[str, int]:
    """
    One-hot encode categorical features based on explicit mappings.

    Parameters:
    -----------
    data_dict : Dict[str, Any]
        Input dictionary containing categorical feature values
    categorical_mappings : Dict[str, List[str]]
        Mapping of feature names to their possible values
        e.g., {'road_type': ['highway', 'rural', 'urban']}

    Returns:
    --------
    Dict[str, int]
        Dictionary with one-hot encoded categorical features
        e.g., {'road_type_highway': 1, 'road_type_rural': 0, ...}
    """
    encoded = {}

    for feature_name, possible_values in categorical_mappings.items():
        actual_value = data_dict.get(feature_name)
        for value in possible_values:
            encoded_col_name = f"{feature_name}_{value}"
            encoded[encoded_col_name] = 1 if actual_value == value else 0

    return encoded


def prepare_inference_data(raw_input: Dict[str, Any], model, categorical_mappings: Dict[str, List[str]], numerical_features: List[str]) -> pd.DataFrame:
    """
    Convert raw API input to properly formatted dataframe matching model expectations.

    This function:
    1. Validates input data (raises PreprocessingError if invalid)
    2. Extracts numerical features directly
    3. One-hot encodes categorical features
    4. Aligns column order to match model.feature_names_in_ (critical for correct predictions)

    Parameters:
    -----------
    raw_input : Dict[str, Any]
        Raw input dictionary from FastAPI (e.g., from AccidentData.dict())
    model : RandomForestClassifier
        Trained model with feature_names_in_ attribute
    categorical_mappings : Dict[str, List[str]]
        Mapping of categorical feature names to their possible values
    numerical_features : List[str]
        List of numerical feature names

    Returns:
    --------
    pd.DataFrame
        DataFrame with columns in the exact order expected by the model
        Shape: (1, len(model.feature_names_in_))

    Raises:
    -------
    PreprocessingError
        If any input validation fails
    """
    # Step 0: VALIDATE INPUT - Fail fast if invalid
    validate_input(raw_input, categorical_mappings, numerical_features)

    # Step 1: Extract numerical features
    numerical_data = {feature: raw_input.get(feature) for feature in numerical_features}

    # Step 2: One-hot encode categorical features
    categorical_data = encode_categorical_features(raw_input, categorical_mappings)

    # Step 3: Combine all features into single dictionary
    all_features = {**numerical_data, **categorical_data}

    # Step 4: Create DataFrame
    df = pd.DataFrame([all_features])

    # Step 5: CRITICAL - Reindex to match model's expected column order
    # This is the fix for the feature order mismatch bug
    df_aligned = df.reindex(columns=model.feature_names_in_, fill_value=0)

    return df_aligned


def get_model_features(model) -> List[str]:
    """
    Extract the feature names the model expects.

    The trained model stores its expected feature names in the
    feature_names_in_ attribute, set during training.

    Parameters:
    -----------
    model : RandomForestClassifier
        Trained model with feature_names_in_ attribute

    Returns:
    --------
    List[str]
        List of feature names in the order the model expects
    """
    return list(model.feature_names_in_)
