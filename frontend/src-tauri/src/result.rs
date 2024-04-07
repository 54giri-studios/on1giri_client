#[derive(serde::Serialize)]
pub enum ResultCode {
    ERROR,
    SUCCESS,
}

#[derive(serde::Serialize)]
pub struct OperationResult {
    content: String,
    code: ResultCode,
}

impl OperationResult {
    pub fn new(content: String, code: ResultCode) -> OperationResult {
        OperationResult {
            content,
            code,
        }
    }
}
