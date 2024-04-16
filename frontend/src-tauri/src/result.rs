use std::fmt::{self, Formatter};

#[derive(serde::Serialize, Debug, PartialEq)]
pub enum ResultCode {
    ERROR,
    SUCCESS,
}

#[derive(serde::Serialize)]
pub struct OperationResult {
    pub error_msg: Option<String>,
    pub content: Option<serde_json::Value>,
    pub code: ResultCode,
}

impl fmt::Debug for OperationResult {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "OperationResult {{ content: {:?}, code: {:?}, error_msg: {:?} }}",
            self.content, self.code, self.error_msg,
        )
    }
}

impl OperationResult {
    pub fn new(
        content: Option<serde_json::Value>,
        code: ResultCode,
        error_msg: Option<String>,
    ) -> OperationResult {
        OperationResult {
            content,
            code,
            error_msg,
        }
    }
}
